import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 text-muted-foreground">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
        Polityka Prywatności
      </h1>

      <div className="max-w-4xl mx-auto bg-glass p-8 rounded-lg space-y-8 border border-border-color">
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§1 Postanowienia ogólne</h2>
          <p className="mb-2">
            1. Niniejsza polityka prywatności ma charakter informacyjny i określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem przez nich z usług oferowanych przez stronę internetową NORBS SERVICE (dalej: "Serwis").
          </p>
          <p>
            2. Administratorem danych osobowych zawartych w serwisie jest NORBS SERVICE z siedzibą w Monster, Holandia, servicenorbs@gmail.com (dalej: "Administrator").
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§2 Administrator Danych Osobowych</h2>
          <p className="mb-2">
            1. Dane osobowe Użytkowników są przetwarzane zgodnie z obowiązującymi przepisami prawa, w tym Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).
          </p>
          <p>
            2. Administrator dokłada szczególnej staranności w celu ochrony interesów osób, których dane dotyczą, a w szczególności zapewnia, że zbierane przez niego dane są przetwarzane zgodnie z prawem.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§3 Cel i zakres zbierania danych</h2>
          <p className="mb-2">
            1. Dane osobowe Użytkowników zbierane są w celu obsługi zapytań przesyłanych przez formularz kontaktowy, co obejmuje imię, nazwisko, adres e-mail oraz numer telefonu.
          </p>
          <p className="mb-2">
            2. Podanie danych osobowych jest dobrowolne, ale niezbędne do przetworzenia zapytania i udzielenia odpowiedzi.
          </p>
          <p>
            3. Administrator może przetwarzać dane w celach marketingowych, wyłącznie za uprzednią zgodą Użytkownika.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§4 Prawa osób, których dane dotyczą</h2>
          <p className="mb-2">
            1. Użytkownik ma prawo dostępu do treści swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, a także prawo do przenoszenia danych.
          </p>
          <p className="mb-2">
            2. Użytkownik ma prawo do wniesienia sprzeciwu w zakresie przetwarzania danych osobowych.
          </p>
           <p>
            3. W celu realizacji uprawnień, o których mowa powyżej, można kontaktować się z Administratorem poprzez przesłanie stosownej wiadomości e-mail na adres: servicenorbs@gmail.com.
          </p>
        </section>
        
         <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§5 Pliki Cookies</h2>
          <p className="mb-2">
            1. Serwis korzysta z plików cookies (ciasteczek), które stanowią dane informatyczne, w szczególności pliki tekstowe, przechowywane w urządzeniu końcowym Użytkownika Serwisu.
          </p>
          <p>
            2. Pliki cookies wykorzystywane są w celu dostosowania zawartości stron internetowych Serwisu do preferencji Użytkownika oraz optymalizacji korzystania ze stron internetowych; w szczególności pliki te pozwalają rozpoznać urządzenie Użytkownika Serwisu i odpowiednio wyświetlić stronę internetową, dostosowaną do jego indywidualnych potrzeb.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§6 Postanowienia końcowe</h2>
          <p className="mb-2">
            1. Administrator stosuje środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych osobowych odpowiednią do zagrożeń oraz kategorii danych objętych ochroną.
          </p>
          <p>
            2. Administrator zastrzega sobie prawo do wprowadzania zmian w polityce prywatności. O wszelkich zmianach Użytkownicy będą informowani na stronie Serwisu.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;