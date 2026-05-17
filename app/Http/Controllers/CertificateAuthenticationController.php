<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Smalot\PdfParser\Parser;

class CertificateAuthenticationController extends Controller
{
    public function challenge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'certificate_text' => ['nullable', 'string', 'max:12000', 'required_without:certificate_file'],
            'certificate_file' => ['nullable', 'file', 'mimes:pdf,txt,text,csv', 'max:5120', 'required_without:certificate_text'],
        ]);

        $certificateText = $this->certificateTextFromRequest($request, $validated['certificate_text'] ?? '');

        if (strlen(trim($certificateText)) < 30) {
            throw ValidationException::withMessages([
                'certificate_file' => 'Could not read enough text from this certificate. If it is a scanned PDF, paste the certificate text manually.',
            ]);
        }

        $questions = $this->buildQuestions($certificateText);

        if (count($questions) < 2) {
            throw ValidationException::withMessages([
                'certificate_file' => 'Could not find enough certificate details to ask good questions. Please use a clearer certificate or paste text that includes name, course, score, issuer, date, or certificate ID.',
            ]);
        }

        $challengeId = (string) Str::uuid();

        Cache::put(
            $this->cacheKey($challengeId),
            collect($questions)->mapWithKeys(fn (array $question) => [
                $question['id'] => $this->normalizeAnswer($question['answer']),
            ])->all(),
            now()->addMinutes(20)
        );

        return response()->json([
            'challenge_id' => $challengeId,
            'questions' => collect($questions)
                ->map(fn (array $question) => [
                    'id' => $question['id'],
                    'question' => $question['question'],
                    'hint' => $question['hint'],
                ])
                ->values(),
        ]);
    }

    private function certificateTextFromRequest(Request $request, string $certificateText): string
    {
        if (!$request->hasFile('certificate_file')) {
            return $certificateText;
        }

        $file = $request->file('certificate_file');

        if ($file->getClientOriginalExtension() === 'pdf' || $file->getMimeType() === 'application/pdf') {
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getRealPath());

            return $pdf->getText();
        }

        return file_get_contents($file->getRealPath()) ?: $certificateText;
    }

    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challenge_id' => ['required', 'string'],
            'answers' => ['required', 'array', 'min:1'],
            'answers.*' => ['nullable', 'string', 'max:300'],
        ]);

        $expectedAnswers = Cache::get($this->cacheKey($validated['challenge_id']));

        if (!$expectedAnswers) {
            return response()->json([
                'message' => 'This certificate challenge expired. Please generate questions again.',
            ], 410);
        }

        $correctCount = 0;
        $results = [];

        foreach ($expectedAnswers as $id => $expectedAnswer) {
            $givenAnswer = $this->normalizeAnswer($validated['answers'][$id] ?? '');
            $isCorrect = $givenAnswer === $expectedAnswer;

            if ($isCorrect) {
                $correctCount++;
            }

            $results[] = [
                'id' => $id,
                'correct' => $isCorrect,
            ];
        }

        $passed = $correctCount === count($expectedAnswers);

        return response()->json([
            'passed' => $passed,
            'message' => $passed ? 'Correct certificate password.' : 'Wrong certificate password.',
            'correct_count' => $correctCount,
            'total' => count($expectedAnswers),
            'results' => $results,
        ]);
    }

    private function buildQuestions(string $certificateText): array
    {
        $cleanText = trim(preg_replace('/\s+/', ' ', $certificateText));
        $lines = collect(preg_split('/\R+/', trim($certificateText)))
            ->map(fn (string $line) => trim(preg_replace('/\s+/', ' ', $line)))
            ->filter()
            ->values();

        $fields = [
            'name' => $this->firstMatch($cleanText, [
                '/(?:presented|awarded)\s+to\s+([A-Z][A-Za-z .\'-]{2,80}?)(?:\s+for|\s+has|\s+on|\.|,|$)/i',
                '/certif(?:y|ies)\s+(?:that\s+)?([A-Z][A-Za-z .\'-]{2,80}?)(?:\s+has|\s+is|\s+successfully|\s+completed)/i',
                '/(?:name|student|recipient)\s*[:\-]\s*([A-Za-z .\'-]{2,80})/i',
            ]) ?: $this->lineAfterCue($lines, [
                'presented to',
                'awarded to',
                'recipient',
                'student name',
                'certifies that',
                'certify that',
            ]),
            'course' => $this->firstMatch($cleanText, [
                '/(?:course|program|workshop|training)\s*[:\-]\s*([A-Za-z0-9 .,&()\'-]{3,100}?)(?:\.| score| marks| grade| issued by| issuer| organization| date| certificate id| credential id|$)/i',
                '/(?:completed|completion of|participated in|for completing)\s+(?:the\s+)?([A-Za-z0-9 .,&()\'-]{3,100}?)(?:\.| with | score| marks| grade| issued by| issuer| organization| date| certificate id| credential id|$)/i',
            ]) ?: $this->lineAfterCue($lines, [
                'course',
                'program',
                'workshop',
                'training',
            ]),
            'score' => $this->firstMatch($cleanText, [
                '/(?:score|marks|percentage|percent|result)\s*[:\-]\s*([A-Za-z0-9 .\/%+-]{1,40}?)(?:\.| issued by| issuer| organization| date| certificate id| credential id|$)/i',
                '/(?:grade|cgpa|gpa)\s*[:\-]\s*([A-Za-z0-9 .\/%+-]{1,40}?)(?:\.| issued by| issuer| organization| date| certificate id| credential id|$)/i',
                '/(?:scored|secured|obtained)\s+([0-9]{1,3}(?:\.\d+)?\s*(?:%|\/\s*[0-9]{1,3})?)/i',
                '/(?:with\s+(?:a\s+)?(?:score|grade|percentage)\s+of)\s+([A-Za-z0-9 .\/%+-]{1,40}?)(?:\.| issued by| issuer| organization| date| certificate id| credential id|$)/i',
            ]) ?: $this->lineAfterCue($lines, [
                'score',
                'marks',
                'percentage',
                'grade',
                'cgpa',
                'gpa',
            ]),
            'issuer' => $this->firstMatch($cleanText, [
                '/(?:issued by|issuer|organization|institute)\s*[:\-]\s*([A-Za-z0-9 .,&()\'-]{3,100}?)(?:\.| date| certificate id| credential id|$)/i',
                '/(?:awarded by)\s+([A-Za-z0-9 .,&()\'-]{3,100}?)(?:\.| date| certificate id| credential id|$)/i',
            ]) ?: $this->lineAfterCue($lines, [
                'issued by',
                'issuer',
                'organization',
                'institute',
                'awarded by',
            ]),
            'date' => $this->firstMatch($cleanText, [
                '/(?:date|issued on|awarded on)\s*[:\-]\s*([A-Za-z0-9 ,\/.-]{4,40}?)(?:\.| certificate id| credential id| serial|$)/i',
                '/\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/',
                '/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/i',
            ]) ?: $this->lineAfterCue($lines, [
                'date',
                'issued on',
                'awarded on',
            ]),
            'certificate_id' => $this->firstMatch($cleanText, [
                '/(?:certificate\s*(?:id|no|number)|credential\s*(?:id|no|number)|serial\s*(?:no|number))\s*[:\-#]\s*([A-Za-z0-9-]{3,60})/i',
                '/\b([A-Z]{2,6}-\d{3,8}(?:-\d{2,6})?)\b/',
            ]) ?: $this->lineAfterCue($lines, [
                'certificate id',
                'certificate no',
                'certificate number',
                'credential id',
                'serial number',
            ]),
        ];

        $questions = [];
        $questionMap = [
            'name' => 'Whose certificate is this?',
            'score' => 'What score, grade, marks, or percentage is shown on the certificate?',
            'course' => 'Which course or program is mentioned on the certificate?',
            'issuer' => 'Who issued the certificate?',
            'date' => 'What date is written on the certificate?',
            'certificate_id' => 'What is the certificate or credential ID?',
        ];

        foreach ($questionMap as $field => $question) {
            if (!empty($fields[$field]) && count($questions) < 4) {
                $questions[] = [
                    'id' => $field,
                    'question' => $question,
                    'answer' => $fields[$field],
                    'hint' => $this->hintForField($field),
                ];
            }
        }

        return array_slice($questions, 0, 4);
    }

    private function lineAfterCue($lines, array $cues): ?string
    {
        foreach ($lines as $index => $line) {
            $lineLower = Str::of($line)->lower()->toString();

            foreach ($cues as $cue) {
                if (!str_contains($lineLower, $cue)) {
                    continue;
                }

                if (str_contains($line, ':')) {
                    $value = trim(Str::after($line, ':'));

                    if ($this->looksLikeAnswer($value)) {
                        return $value;
                    }
                }

                $nextLine = $lines[$index + 1] ?? null;

                if ($nextLine && $this->looksLikeAnswer($nextLine)) {
                    return $nextLine;
                }
            }
        }

        return null;
    }

    private function looksLikeAnswer(string $value): bool
    {
        $value = trim($value, " \t\n\r\0\x0B.,");

        if (strlen($value) < 2 || strlen($value) > 100) {
            return false;
        }

        return !preg_match('/^(certificate|course|program|date|issued by|score|grade)$/i', $value);
    }

    private function hintForField(string $field): string
    {
        return match ($field) {
            'name' => 'Use the recipient or student name from the certificate.',
            'score' => 'Use the score, grade, marks, percentage, CGPA, or GPA exactly as shown.',
            'course' => 'Use the course, program, workshop, or training name.',
            'issuer' => 'Use the organization, institute, or issuer name.',
            'date' => 'Use the issued, awarded, or completion date.',
            'certificate_id' => 'Use the certificate number, credential ID, or serial number.',
            default => 'Answer using a meaningful detail from the certificate.',
        };
    }

    private function firstMatch(string $text, array $patterns): ?string
    {
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                return trim($matches[1], " \t\n\r\0\x0B.,");
            }
        }

        return null;
    }

    private function normalizeAnswer(?string $answer): string
    {
        return Str::of($answer ?? '')
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', ' ')
            ->squish()
            ->toString();
    }

    private function cacheKey(string $challengeId): string
    {
        return 'certificate_challenge_'.$challengeId;
    }
}
