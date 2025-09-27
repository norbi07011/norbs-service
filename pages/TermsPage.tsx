import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-20 text-muted-foreground">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
        Regulamin Świadczenia Usług
      </h1>

      <div className="max-w-4xl mx-auto bg-glass p-8 rounded-lg space-y-8 border border-border-color">
        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§1 Postanowienia ogólne</h2>
          <p className="mb-2">
            1. Niniejszy regulamin określa zasady świadczenia usług marketingowych przez NORBS SERVICE z siedzibą w Monster, Holandia (dalej jako "Wykonawca").
          </p>
          <p className="mb-2">
            2. Złożenie zamówienia jest równoznaczne z akceptacją niniejszego regulaminu.
          </p>
          <p>
            3. Klientem (dalej jako "Zamawiający") może być każda osoba fizyczna, prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§2 Zakres usług</h2>
          <p className="mb-2">
            1. Wykonawca świadczy usługi w zakresie: projektowania graficznego, tworzenia stron internetowych, fotografii oraz produkcji wideo, zgodnie z ofertą przedstawioną na stronie internetowej.
          </p>
          <p>
            2. Szczegółowy zakres prac dla każdego zlecenia jest ustalany indywidualnie z Zamawiającym i potwierdzany w formie briefu lub umowy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§3 Zamówienia i płatności</h2>
          <p className="mb-2">
            1. Zamówienia przyjmowane są poprzez formularz kontaktowy na stronie, e-mail lub WhatsApp.
          </p>
          <p className="mb-2">
            2. Realizacja zlecenia rozpoczyna się po ustaleniu szczegółów i, w zależności od wartości zlecenia, po wpłacie zaliczki w wysokości 50% wartości zamówienia.
          </p>
          <p className="mb-2">
            3. Pozostała część wynagrodzenia płatna jest po akceptacji finalnego projektu, przed przekazaniem plików źródłowych lub udostępnieniem strony na serwerze docelowym.
          </p>
           <p>
            4. Wszystkie ceny podane w ofercie są cenami netto.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§4 Prawa autorskie i licencje</h2>
          <p className="mb-2">
            1. Wykonawca przenosi na Zamawiającego majątkowe prawa autorskie do finalnego, zaakceptowanego projektu na polach eksploatacji określonych w umowie, po uregulowaniu całości wynagrodzenia.
          </p>
          <p className="mb-2">
            2. Wykonawca zastrzega sobie prawo do prezentowania wykonanego projektu w swoim portfolio (na stronie internetowej, w mediach społecznościowych itp.) w celach promocyjnych.
          </p>
           <p>
            3. Wszelkie projekty wstępne, koncepcje i propozycje odrzucone przez Zamawiającego pozostają własnością Wykonawcy i nie mogą być wykorzystywane bez jego zgody.
          </p>
        </section>
        
         <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§5 Odpowiedzialność i reklamacje</h2>
          <p className="mb-2">
            1. Wykonawca zobowiązuje się do wykonania zlecenia z należytą starannością i zgodnie z ustaleniami.
          </p>
          <p className="mb-2">
            2. Zamawiający ma prawo do zgłoszenia poprawek do projektu. W cenie standardowej usługi zawarte są dwie tury poprawek. Każda kolejna tura jest dodatkowo płatna.
          </p>
           <p>
            3. Po ostatecznej akceptacji projektu przez Zamawiającego, Wykonawca nie ponosi odpowiedzialności za błędy (np. literowe) znalezione w późniejszym terminie.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-accent mb-4">§6 Postanowienia końcowe</h2>
          <p className="mb-2">
            1. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa holenderskiego.
          </p>
          <p>
            2. Wykonawca zastrzega sobie prawo do zmiany regulaminu. Zmiany wchodzą w życie z chwilą ich publikacji na stronie internetowej.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;