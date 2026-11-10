---
slug: ai-agents-platform
title: AI Agent Platform
tagline: Platforma w stylu produkcyjnym do konfigurowania agentów AI, uruchamiania wieloetapowych zadań z narzędziami i zatwierdzania wrażliwych akcji w czasie rzeczywistym.
lang: pl
status: active
period: 2026-10
role: Samodzielny developer (full stack)
stack:
  frontend: [Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Socket.IO client]
  backend: [NestJS 12, TypeScript (ESM), TypeORM, BullMQ, Socket.IO, Zod, class-validator]
  database: [PostgreSQL, Redis]
  infra: [BullMQ workers, WebSockets]
  ai: [Google Gemini (function calling)]
tags: [ai-agents, llm, function-calling, human-in-the-loop, job-queue, websockets, rag, nestjs, nextjs]
repo: https://github.com/MaksZiem/ai-agents-platform
demo: null
cover: screenshots/cover.png
screenshots:
  - file: screenshots/dashboard.png
    caption: Dashboard z liczbą agentów, trwającymi wykonaniami i oczekującymi akceptacjami
  - file: screenshots/agent-config.png
    caption: Konfiguracja agenta – model, instrukcje, narzędzia i uprawnienia
  - file: screenshots/execution-live.png
    caption: Oś czasu wykonania na żywo z wywołaniami narzędzi, wejściem i wyjściem
  - file: screenshots/approval.png
    caption: Akceptacja wrażliwego wywołania narzędzia przez człowieka (human-in-the-loop)
  - file: screenshots/execution-metrics.png
    caption: Metryki wykonania – czas, wywołania LLM, tokeny, ponowienia
featured: true
order: 1
---

# AI Agent Platform

## Opis

AI Agent Platform to aplikacja full-stack w stylu SaaS do tworzenia agentów AI, nadawania im konkretnych narzędzi, wiedzy i uprawnień oraz zlecania im wieloetapowych zadań. Agent planuje pracę przez function calling w Gemini, wykonuje narzędzia krok po kroku w workerze w tle, zatrzymuje się przed wrażliwymi akcjami i czeka na decyzję człowieka, a każdy krok trafia do UI na żywo. Każde wykonanie jest zapisywane i można je później przejrzeć.

To celowo **platforma wykonawcza, a nie chatbot**: model jest traktowany jako niezaufany komponent, a o tym, co faktycznie wolno mu zrobić, decyduje backend.

## Problem

Większość demo „agentów AI” to okno czatu z promptem. To się sypie, gdy agent ma wykonać prawdziwą pracę:

- **Bezpieczeństwo:** LLM może wywołać dowolne narzędzie, które widzi. Uprawnienia zapisane w prompcie nie są uprawnieniami.
- **Niezawodność:** wywołania modelu przekraczają timeout, trafiają na limity albo zwracają błędny format. Procesy padają w połowie zadania.
- **Widoczność:** użytkownik i developer nie wiedzą, co agent zrobił, dlaczego i ile to kosztowało.
- **Kontrola:** wrażliwe akcje (wysłanie maila, zmiana danych) wymagają decyzji człowieka, a wykonanie musi na nią poczekać, czasem godzinami.

Platforma rozwiązuje to przez uprawnienia egzekwowane na backendzie, trwały i wznawialny silnik wykonawczy na kolejce zadań, akceptacje human-in-the-loop oraz podgląd każdego kroku na żywo.

**Dla kogo:** dla developerów, którzy chcą widzieć każdy krok w szczegółach (wejście, wyjście, tokeny, ponowienia), oraz dla analityków i małych zespołów, którzy po prostu zlecają zadanie, akceptują akcje i czytają wynik.

## Kluczowe funkcje

- **Zarządzanie agentami:** tworzenie, edycja, duplikowanie, aktywacja/dezaktywacja i usuwanie. Konfiguracja modelu, temperatury, limitu tokenów i instrukcji systemowych.
- **Rejestr narzędzi:** typowane narzędzia ze schematami Zod dla wejścia i wyjścia: `getTransactions`, `analyzeTransactions`, `comparePeriods`, `generateReport`, `searchDocuments`, `sendEmail`.
- **Uprawnienia per agent:** macierz zasób/akcja (`financial_data:read`, `documents:search`, `email:send` …) sprawdzana przez backend przed każdym wywołaniem narzędzia.
- **Akceptacje human-in-the-loop:** narzędzie może wymagać akceptacji globalnie albo dla konkretnego agenta. Wykonanie się zatrzymuje, użytkownik widzi narzędzie, dane wejściowe i uzasadnienie agenta, po czym akceptuje albo odrzuca.
- **Autonomiczne planowanie:** agent sam decyduje, które narzędzia wywołać (równolegle, gdy to możliwe) i kiedy podać ostateczną odpowiedź.
- **UI wykonania na żywo:** aktualizacje kroków przez WebSockety (Socket.IO), bez ręcznego odświeżania strony.
- **Ponowienia i obsługa błędów:** rozróżnienie błędów, które warto ponowić, od trwałych, ponowienia z rosnącym opóźnieniem i widoczne próby („Attempt 2 / 3”).
- **Anulowanie:** anulowanie trwającego wykonania blokuje start kolejnych kroków.
- **Odporność na awarie:** gdy worker padnie w trakcie, BullMQ dostarcza zadanie ponownie, a silnik wznawia pracę z zapisanych kroków.
- **Baza wiedzy (prosty RAG):** wgrywanie plików `.pdf`, `.txt`, `.md`, `.csv` i `.json`, ekstrakcja tekstu, podział na fragmenty, przypinanie dokumentów do agentów i wyszukiwanie słów kluczowych.
- **Obserwowalność:** metryki każdego wykonania: czas trwania, wywołania LLM i narzędzi, ponowienia, nieudane kroki, prośby o akceptację oraz tokeny wejściowe i wyjściowe.
- **Dashboard:** liczba agentów, dzisiejsze zadania, trwające wykonania, oczekujące akceptacje i ostatnie wykonania.

## Stack technologiczny

| Warstwa | Technologia | Dlaczego |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind v4 | Server Components i Server Actions trzymają JWT w ciasteczku httpOnly, więc przeglądarka nigdy nie dotyka tokena API |
| Realtime | Socket.IO (namespace `/executions`) | Pokój per wykonanie, handshake z JWT, proste reconnecty |
| Backend | NestJS 12 (ESM, TypeScript) | Moduły i DI dobrze odwzorowują domenę: agenci, narzędzia, silnik, akceptacje, wiedza |
| ORM / DB | TypeORM + PostgreSQL | Model relacyjny, `jsonb` na wejście/wyjście kroków, zmiany wyłącznie przez migracje (`synchronize: false`) |
| Kolejka | BullMQ + Redis | Trwałe zadania, ponowne dostarczenie po awarii, kontrola współbieżności, idempotentne ID zadań |
| LLM | Google Gemini przez `@google/genai` | Natywny function calling. Abstrakcja `Planner` pozwala wymienić dostawcę |
| Walidacja | Zod (narzędzia), class-validator (DTO HTTP) | Jeden schemat Zod waliduje wejście i wyjście narzędzia **oraz** generuje JSON Schema wysyłany do Gemini |
| Auth | JWT + argon2 | Bezstanowa autoryzacja API, plus osobny krótkożyjący token dla WebSocketów |
| Testy / lint | Vitest, oxlint, Prettier | Szybki runner testów i linter z natywnym wsparciem ESM |

## Architektura

```mermaid
flowchart LR
  subgraph Browser
    UI[Next.js UI<br/>Server Components + Server Actions]
    WS[Socket.IO client]
  end

  subgraph API["NestJS API (/api)"]
    AUTH[Auth / JWT guard]
    AG[Agents · Tools · Permissions]
    EX[Executions]
    AP[Approvals]
    KN[Knowledge]
    GW[ExecutionEventsGateway<br/>/executions namespace]
  end

  subgraph Engine["Execution engine (BullMQ worker)"]
    PROC[ExecutionsProcessor<br/>concurrency 5]
    RUN[ExecutionRunner<br/>agent loop]
    PLAN[Planner<br/>GeminiPlanner / MockPlanner]
    TEX[ToolExecutor<br/>permissions · validation · approval]
    SM[ExecutionStateManager<br/>state machine + events]
    AM[ApprovalManager]
  end

  PG[(PostgreSQL)]
  RD[(Redis)]
  GEM[[Google Gemini API]]

  UI -- REST + JWT --> API
  WS <-- live events --> GW
  EX -- enqueue job --> RD
  AP -- resume job --> RD
  RD --> PROC --> RUN
  RUN --> PLAN --> GEM
  RUN --> TEX
  RUN --> SM
  RUN --> AM
  SM -- EventEmitter --> GW
  API --> PG
  Engine --> PG
  TEX -- searchDocuments --> KN
```

**Warstwa API** tylko waliduje żądania, zapisuje stan i dodaje zadania do kolejki. Cała praca agenta odbywa się w **silniku**, który działa w workerze BullMQ. Silnik nigdy nie ufa modelowi: każde wywołanie narzędzia przechodzi przez `ToolExecutor`, który sprawdza, czy narzędzie jest włączone dla agenta, czy agent ma wymagane uprawnienie, czy wejście pasuje do schematu i czy potrzebna jest akceptacja.

## Przepływ danych: zadanie z akceptacją

```mermaid
sequenceDiagram
  actor U as User
  participant FE as Next.js
  participant API as NestJS API
  participant Q as BullMQ (Redis)
  participant W as ExecutionRunner
  participant G as Gemini
  participant T as ToolExecutor
  participant DB as PostgreSQL
  participant S as Socket.IO

  U->>FE: "Przeanalizuj wydatki Q1 vs Q4 i wyślij raport mailem"
  FE->>API: POST /api/agents/:id/executions
  API->>DB: insert execution (QUEUED)
  API->>Q: add job {executionId}
  Q->>W: process job
  W->>DB: QUEUED → RUNNING
  loop aż do odpowiedzi końcowej (max 10 tur modelu)
    W->>G: generateContent(task, history, tool declarations)
    G-->>W: tool calls (np. getTransactions ×2)
    W->>DB: PLAN step (COMPLETED)
    W-->>S: step.updated
    S-->>FE: aktualizacja na żywo
    W->>T: execute(tool, input)
    T->>DB: narzędzie włączone? uprawnienie?
    T-->>W: output (zwalidowany schematem)
    W->>DB: TOOL_CALL step (COMPLETED)
  end
  W->>T: execute(sendEmail)
  T-->>W: approval_required
  W->>DB: RUNNING → WAITING_FOR_APPROVAL + Approval (PENDING)
  W-->>S: execution.updated
  Note over W: zadanie się kończy, nic nie blokuje workera
  U->>FE: Approve
  FE->>API: POST /api/approvals/:id/approve
  API->>Q: add job (jobId = executionId-approvalId)
  Q->>W: wznowienie
  W->>T: execute(sendEmail, approved=true)
  W->>G: kolejna tura z wynikami narzędzi
  G-->>W: odpowiedź końcowa (tekst)
  W->>DB: FINAL_ANSWER step, RUNNING → COMPLETED
  W-->>S: execution.updated
```

Stan wykonania żyje **w całości w bazie danych** jako uporządkowana lista kroków. Runner przy każdej turze odtwarza z nich rozmowę z modelem. Dzięki temu wstrzymane albo przerwane awarią wykonanie wznawia się dokładnie w miejscu, w którym stanęło.

## Schemat bazy danych

```mermaid
erDiagram
  users ||--o{ agents : owns
  users ||--o{ executions : starts
  users ||--o{ knowledge_documents : uploads
  users ||--o{ approvals : decides
  agents ||--o{ agent_tools : "has enabled"
  agents ||--o{ agent_permissions : "is granted"
  agents ||--o{ agent_documents : "can search"
  agents ||--o{ executions : runs
  knowledge_documents ||--o{ agent_documents : "attached to"
  knowledge_documents ||--o{ document_chunks : "split into"
  executions ||--o{ execution_steps : contains
  executions ||--o{ approvals : has
  execution_steps ||--o| approvals : "paused by"

  users {
    uuid id PK
    string email UK
    string passwordHash "argon2, never selected by default"
    string name
    timestamptz createdAt
  }
  agents {
    uuid id PK
    uuid userId FK
    string name
    text description
    string icon
    text instructions
    enum status "ACTIVE | INACTIVE"
    enum provider "GEMINI"
    string model
    real temperature
    int maxOutputTokens
  }
  agent_tools {
    uuid id PK
    uuid agentId FK
    string toolName "unique per agent"
    bool requiresApproval
  }
  agent_permissions {
    uuid id PK
    uuid agentId FK
    string resource "financial_data | documents | reports | email"
    string action "read | search | modify | delete | create | send"
  }
  executions {
    uuid id PK
    uuid agentId FK
    uuid userId FK
    text task
    enum status "QUEUED | RUNNING | WAITING_FOR_APPROVAL | COMPLETED | FAILED | CANCELLED"
    text result
    text error
    string model
    int llmCalls
    int inputTokens
    int outputTokens
    timestamptz startedAt
    timestamptz finishedAt
  }
  execution_steps {
    uuid id PK
    uuid executionId FK
    int position "unique per execution"
    enum type "PLAN | TOOL_CALL | FINAL_ANSWER"
    enum status "PENDING | RUNNING | WAITING_FOR_APPROVAL | COMPLETED | FAILED | SKIPPED"
    string toolName
    jsonb input
    jsonb output
    text error
    int attempt
    timestamptz startedAt
    timestamptz finishedAt
  }
  approvals {
    uuid id PK
    uuid executionId FK
    uuid stepId FK "unique"
    uuid userId FK
    string toolName
    jsonb input
    text reason "agent's own explanation"
    enum status "PENDING | APPROVED | REJECTED | CANCELLED"
    timestamptz decidedAt
  }
  knowledge_documents {
    uuid id PK
    uuid userId FK
    string name
    string mimeType
    int sizeBytes
    int characterCount
    int chunkCount
  }
  document_chunks {
    uuid id PK
    uuid documentId FK
    int position
    text content
  }
  agent_documents {
    uuid id PK
    uuid agentId FK
    uuid documentId FK
  }
```

Schemat powstaje z 12 przyrostowych migracji TypeORM. Przejścia statusu wykonania pilnuje jawna maszyna stanów (`execution-status.ts`), a każdy zapis to warunkowy `UPDATE … WHERE status = <oczekiwany>`, więc dwa workery nigdy nie przesuną tego samego wykonania jednocześnie.

## Najważniejsze endpointy API

Wszystkie trasy są pod `/api` i wymagają JWT, chyba że oznaczono je jako publiczne.

| Metoda | Trasa | Cel |
|---|---|---|
| `POST` | `/auth/register`, `/auth/login` | Rejestracja i logowanie |
| `POST` | `/auth/socket-token` | Krótkożyjący (60 s) token do handshake'u WebSocket |
| `GET/POST/PATCH/DELETE` | `/agents`, `/agents/:id` | CRUD agentów |
| `POST` | `/agents/:id/duplicate` | Klonowanie agenta z konfiguracją |
| `PUT/DELETE` | `/agents/:agentId/tools/:toolName` | Włączenie lub wyłączenie narzędzia, opcjonalnie z akceptacją |
| `PUT` | `/agents/:agentId/permissions` | Podmiana zestawu uprawnień agenta |
| `PUT/DELETE` | `/agents/:agentId/knowledge/:documentId` | Przypięcie lub odpięcie dokumentu |
| `POST` | `/agents/:agentId/executions` | Start zadania |
| `GET` | `/executions/:id` | Wykonanie z krokami i wyliczonymi metrykami |
| `POST` | `/executions/:id/cancel` | Anulowanie trwającego wykonania |
| `POST` | `/approvals/:id/approve`, `/approvals/:id/reject` | Decyzja człowieka, która wznawia wykonanie |
| `POST` | `/knowledge` | Upload dokumentu (multipart) |
| `GET` | `/dashboard` | Zagregowane statystyki dashboardu |
| `GET` | `/health` | Health check Postgresa i Redisa |

**Przykład: start zadania**

```http
POST /api/agents/3f1c…/executions
Authorization: Bearer <jwt>
Content-Type: application/json

{ "task": "Analyze Q1 spending, compare it with Q4 and email the report to accountant@company.com" }
```

```json
{
  "id": "9b2e…",
  "agentId": "3f1c…",
  "task": "Analyze Q1 spending, compare it with Q4 and email the report to accountant@company.com",
  "status": "QUEUED",
  "model": "gemini-2.5-flash",
  "llmCalls": 0,
  "inputTokens": 0,
  "outputTokens": 0,
  "createdAt": "2026-10-12T14:32:05.120Z"
}
```

**Zdarzenia WebSocket** (namespace `/executions`): klient wysyła `subscribe` z id wykonania, serwer sprawdza, czy wykonanie należy do użytkownika, i wypycha zdarzenia `execution.updated` oraz `step.updated`.

## Przykładowy przebieg

Agent demo to **Financial Analyst** z włączonymi wszystkimi narzędziami finansowymi, z `sendEmail` wymagającym akceptacji oraz z uprawnieniami `financial_data:read`, `reports:create`, `documents:search` i `email:send`.

1. **Tworzenie agenta** z instrukcjami w stylu *„You are a financial analyst. Never invent financial information…”*, potem wybór narzędzi i uprawnień. *(screen: agent-config.png)*
2. **Start zadania:** *„Przeanalizuj wydatki z Q1 i porównaj je z Q4. Znajdź nietypowe wydatki, przygotuj raport i wyślij go na accountant@company.com.”*
3. **Tura 1 (PLAN):** Gemini równolegle wywołuje `getTransactions` dwa razy (zakresy Q4 i Q1).
4. **Kroki narzędzi:** oba wywołania przechodzą sprawdzenie uprawnień i walidację schematu, po czym zwracają przykładowe transakcje. Każdy krok pojawia się na osi czasu na żywo, z JSON-em wejścia i wyjścia. *(screen: execution-live.png)*
5. **Tura 2:** model wywołuje `analyzeTransactions` i `comparePeriods`, a następnie `generateReport`.
6. **Tura 3:** model wywołuje `sendEmail` i jednym zdaniem uzasadnia dlaczego. Executor zwraca `approval_required`, a wykonanie przechodzi w **WAITING_FOR_APPROVAL**. Oczekująca akceptacja jest widoczna na dashboardzie i na stronie Approvals.
7. **Akceptacja:** użytkownik widzi odbiorcę, temat, treść i uzasadnienie agenta, po czym klika *Approve*. *(screen: approval.png)*
8. **Wznowienie:** nowe zadanie w kolejce wykonuje zaakceptowane narzędzie, model dostaje wynik i pisze odpowiedź końcową, a wykonanie kończy się jako **COMPLETED**.
9. **Podgląd:** panel metryk pokazuje czas, wywołania LLM, wywołania narzędzi, ponowienia i tokeny. *(screen: execution-metrics.png)*

Jeśli użytkownik kliknie *Reject*, krok dostaje status `SKIPPED`, model otrzymuje komunikat „The user rejected this action.” i dostosowuje odpowiedź.

## Kluczowe decyzje i kompromisy

- **Kroki jako jedyne źródło prawdy.** Silnik nie trzyma stanu agenta w pamięci: rozmowa jest odtwarzana z `execution_steps` przy każdej turze. Kosztuje to dodatkowe zapytanie na turę, ale wznowienie po akceptacji, po awarii i po anulowaniu przechodzi tą samą ścieżką kodu.
- **Czekanie na akceptację nie blokuje workera.** Zadanie kończy się, gdy potrzebna jest akceptacja, a wznawia je nowe zadanie z deterministycznym `jobId = executionId-approvalId`. Wykonanie może czekać godzinami bez żadnego kosztu.
- **Uprawnienia egzekwowane w kodzie, nigdy w prompcie.** Zanim cokolwiek się wykona, `ToolExecutor` sprawdza kolejno: włączone narzędzie, uprawnienie resource:action, wejście względem schematu Zod i wymóg akceptacji.
- **Jeden schemat, trzy zastosowania.** Schemat Zod narzędzia waliduje wejście od modelu i wyjście narzędzia, a po konwersji do JSON Schema (target `openapi-3.0`) trafia do deklaracji funkcji w Gemini.
- **Błędy do ponowienia vs trwałe.** `ModelCallError` i `ToolExecutionError` mają flagę `retryable`. Błąd 429 z krótkim `retryDelay` jest ponawiany, przekroczony limit dzienny już nie. Nieudane wywołanie narzędzia **nie kończy wykonania**: model widzi błąd i może poprawić wejście.
- **`Planner` jako klasa abstrakcyjna.** Działa jako token DI w Nest. `GeminiPlanner` i deterministyczny `MockPlanner` są wymienne, więc da się pracować bez klucza API.
- **Najpierw prosty RAG oparty na słowach kluczowych.** Podział tekstu (1000 znaków, zakładka 150, cięcie na granicach akapitów i zdań) plus scoring częstości słów za stabilnym interfejsem. Embeddingi można wstawić bez zmiany wywołań.

## Wyzwania i rozwiązania

- **Wznawianie rozmowy z modelem po pauzie.** Gemini wymaga, by jego poprzednia wiadomość (razem z *thought signatures*) wróciła w niezmienionej postaci. Rozwiązanie: surowy `Content` od dostawcy jest zapisywany w wyjściu kroku PLAN i odtwarzany dosłownie. Wyniki narzędzi z jednej tury wracają razem, jako jedna wiadomość `user` złożona z części `functionResponse`.
- **Wyścigi między anulowaniem, akceptacją i workerem.** Każda zmiana statusu to warunkowy update (`WHERE id = ? AND status = ?`) sprawdzany względem tabeli dozwolonych przejść. Runner sprawdza `isStillRunning` przed każdym krokiem i po każdym opóźnieniu ponowienia, więc anulowanie zawsze wygrywa i nigdy nie zostaje nadpisane.
- **Awaria workera w trakcie wykonania.** Gdy BullMQ ponownie dostarcza zadanie dla wykonania wciąż oznaczonego jako `RUNNING`, runner oznacza przerwane kroki jako nieudane i pozwala modelowi zdecydować, co dalej, zamiast ślepo powtarzać efekty uboczne.
- **Prompt injection przez wynik narzędzia.** Instrukcja systemowa każe traktować wyniki narzędzi jako dane. A ponieważ wrażliwe narzędzia wymagają zarówno uprawnienia, jak i akceptacji, złośliwy dokument nie zmusi agenta do samodzielnego wysłania maila.
- **Aktualizacje na żywo bez wycieku danych.** Klienci WebSocket uwierzytelniają się osobnym, 60-sekundowym tokenem, a `subscribe` sprawdza, czy wykonanie należy do użytkownika, zanim dołączy go do pokoju.

## Testy i jakość

- **Testy jednostkowe (Vitest):** `ToolExecutor` (uprawnienia, włączenie narzędzia, walidacja, akceptacja), narzędzia finansowe, metryki wykonania, chunking, scoring wyszukiwania w bazie wiedzy, helper `withTimeout`.
- **Linting i formatowanie:** oxlint i Prettier na backendzie, ESLint na frontendzie.
- **Ścisły TypeScript** w obu aplikacjach i walidacja DTO (`whitelist`, `forbidNonWhitelisted`) dla każdego żądania HTTP.
- <!-- TODO: dodać CI (GitHub Actions) i testy e2e, jeśli/gdy powstaną -->

## Bezpieczeństwo

- Hasła hashowane **argon2**; `passwordHash` jest wykluczony z zapytań i serializacji.
- **Guard JWT** domyślnie na każdej trasie, z wyłączeniem przez `@Public()` dla endpointów auth.
- Frontend trzyma token w **ciasteczku httpOnly z sameSite=lax**, a wywołania API idą po stronie serwera w Server Actions.
- **Izolacja danych:** każde zapytanie filtruje po `userId`, a narzędzia dostają `ToolContext` ograniczony do jednego agenta, więc narzędzie nie odczyta dokumentów innego agenta.
- **Uprawnienia do narzędzi i akceptacje egzekwowane na backendzie**; LLM jest traktowany jako niezaufany.
- Brak wykonywania dowolnego kodu: narzędzia to stały, typowany rejestr.
- Sekrety (klucz Gemini, dane dostępowe do bazy) nigdy nie trafiają do promptów.

## Uruchomienie lokalne

Wymagania: Node.js, PostgreSQL i Redis.

```bash
# backend
cd backend
cp .env.example .env          # ustaw DATABASE_URL, REDIS_URL, JWT_SECRET, GEMINI_API_KEY
npm install
npm run migration:run
npm run start:dev             # http://localhost:3001/api

# frontend
cd ../frontend
npm install
npm run dev                   # http://localhost:3000
```

<!-- TODO: dodać docker-compose dla Postgres + Redis, żeby uruchamiać jedną komendą -->

## Ograniczenia i plany

- Narzędzia to deterministyczne mocki z syntetycznymi danymi finansowymi; `sendEmail` nie wysyła prawdziwych maili.
- Wyszukiwanie w bazie wiedzy opiera się na słowach kluczowych. Następny krok: embeddingi + pgvector.
- Na razie obsługiwany jest tylko Gemini; interfejs `Planner` jest gotowy na kolejnych dostawców.
- W planach: szablony agentów, wersjonowanie instrukcji, wykonania według harmonogramu, MCP i własne narzędzia, limity kosztów i zapytań, przestrzenie zespołowe.

## Czego się nauczyłem

- Projektowania **wznawialnej pętli agenta**, w której cały stan jest trwały, zamiast trzymania rozmowy w pamięci.
- Budowania **maszyny stanów z optymistyczną współbieżnością**, która działa poprawnie przy równoległych workerach, anulowaniach i akceptacjach.
- Praktycznej pracy z **function callingiem LLM**: równoległe wywołania narzędzi, thought signatures, błędnie sformatowane wywołania, obsługa limitów.
- Traktowania modelu jako **niezaufanego aktora** i stawiania granicy bezpieczeństwa na backendzie.
- Spinania **BullMQ + Socket.IO + Next.js Server Components** w UI na żywo bez odpytywania serwera po stronie klienta.
