# 🎟️ Tickets App FE

## 🎯 Cel projektu

Aplikacja webowa (SPA) umożliwiająca przegląd wydarzeń oraz zakup biletów dla użytkowników zalogowanych i niezalogowanych. Projekt skupia się na nowoczesnych rozwiązaniach frontendowych z wykorzystaniem Angulara, zapewniając płynne i bezpieczne doświadczenie zakupowe.

## 🧱 Architektura i główne decyzje projektowe

Projekt został utworzony w repozytorium na uczelnianym GitLabie i posiada kompletną historię zmian. Aplikacja została zrealizowana w Angularze z podejściem *standalone components* oraz *signals*, co pozwala na pisanie nowoczesnego, efektywnego i reaktywnego kodu. Struktura aplikacji została podzielona na trzy główne warstwy:

### 📁 Struktura projektu

- **`core/`** – zawiera:
  - serwisy do komunikacji z backendem oraz inne kluczowe serwisy (np AuthService/LoadingService),
  - komponenty bazowe jak `navbar`, `root-layout`, `toast`, `loading`,
  - `TicketsSocketService`, który umożliwia aktualizację dostępności biletów w czasie rzeczywistym dzięki WebSocketom.

- **`shared/`** – zawiera wspólne komponenty, klasy, typy, serwisy, funkcje, które są wykorzystywane w wielu miejscach aplikacji.

- **`features/`** – zawiera funkcjonalności aplikacji podzielone na moduły/komponenty:
  - `login`, `register`, `events`, `event-details`, `cart`, `payment`, `checkout`, `history`, itd.
  - Każdy z modułów jest pisany w podejściu *standalone*, co pozwala na łatwe skalowanie kodu.
  - Stan aplikacji w praktycznie każdym miejscu zarządzany jest przy pomocy Angular Signals.

### 🔐 Autoryzacja i bezpieczeństwo

- Uwierzytelnianie oparte jest o tokeny JWT z krótkim czasem życia. Tokeny są automatycznie odświeżane co 15 minut.
- Dostęp do panelu administratora (przegląd, edycja i usuwanie wydarzeń oraz kategorii) chroniony jest:
  - po stronie frontendowej guardem opartym na roli w tokenie,
  - po stronie backendu – weryfikacją podpisu JWT przy użyciu klucza prywatnego.
- Próba ręcznej modyfikacji tokena przez użytkownika nie daje efektu – backend odrzuca nieautoryzowane żądania.

### 📅 Moduł wydarzeń (`events`)

Moduł wydarzeń stanowi centralny element aplikacji i zawiera rozbudowaną funkcjonalność:

- **Lista wydarzeń**:
  - pobierana z backendu z paginacją i dynamicznym filtrowaniem (wszystko realizowane po stronie backendu),
  - możliwe jest wyszukiwanie po nazwie oraz filtrowanie po kategorii,
  - checkbox umożliwia wyświetlenie wyłącznie wydarzeń z dostępnymi biletami.

- **Szczegóły wydarzenia**:
  - prezentowane po kliknięciu w kartę wydarzenia,
  - zawierają dokładne informacje o wydarzeniu, liczbę dostępnych miejsc oraz cenę biletu,
  - umożliwiają wybór ilości biletów oraz dodanie ich do koszyka.

- **Koszyk**:
  - po dodaniu biletu pojawia się modal z opcją kontynuowania zakupów lub przejścia do koszyka,
  - dane o koszyku przechowywane są zarówno w serwisie `CartService`, jak i w `localStorage`, dzięki czemu przetrwają odświeżenie strony i ponowne uruchomienie aplikacji.
### 💳 Zakup biletów

- Zakup biletów realizowany jest przez integrację z **Stripe**.
- Przed przekierowaniem do płatności system automatycznie sprawdza dostępność biletów:
  - jeśli bilety są niedostępne, użytkownik nie może kontynuować zakupu i otrzymuje komunikat (toast).
- Statusy zamówień są automatycznie aktualizowane po transakcji.

### 📦 Inne funkcjonalności

- Komponent koszyka (`cart`) pozwala na dynamiczne dodawanie i usuwanie biletów, z synchronizacją ilości dostępnych miejsc.
- Użytkownik po udanej płatności widzi ekran potwierdzający transakcję z opcją przejścia do historii zamówień.
- Komponenty oraz style aplikacji są zgodne z konwencją **BEM**, co ułatwia skalowanie i utrzymanie projektu.

## 🛠 Technologie

- Angular 19 (standalone components, signals)
- TypeScript
- RxJS / Angular Signals
- SCSS (BEM naming + zmienne + mixiny)
- Stripe Payments
- WebSocket (dla aktualizacji danych o biletach)
