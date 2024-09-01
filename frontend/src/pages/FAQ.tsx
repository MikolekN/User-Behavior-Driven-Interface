import { useState } from 'react';
import Tile from '../components/Tile/Tile';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "Jak mogę założyć nowe konto?",
        answer: "Aby założyć nowe konto, odwiedź naszą stronę rejestracyjną lub skontaktuj się z naszym biurem obsługi klienta. Możesz również odwiedzić naszą placówkę, gdzie nasi doradcy pomogą Ci przejść przez proces rejestracji.",
      },
      {
        question: "Jakie są opłaty za prowadzenie konta?",
        answer: "Opłaty za prowadzenie konta różnią się w zależności od rodzaju konta. Szczegółowe informacje o opłatach znajdziesz na naszej stronie internetowej w sekcji 'Cennik' lub kontaktując się z naszym biurem obsługi klienta.",
      },
      {
        question: "Jak mogę zaktualizować moje dane osobowe?",
        answer: "Aby zaktualizować swoje dane osobowe, zaloguj się do swojego konta online i przejdź do sekcji 'Ustawienia konta'. Możesz również odwiedzić naszą placówkę osobiście lub skontaktować się z naszym biurem obsługi klienta.",
      },
      {
        question: "Co zrobić, jeśli zapomnę hasła do konta?",
        answer: "Jeśli zapomniałeś hasła do konta, kliknij opcję 'Zapomniałem hasła' na stronie logowania. Postępuj zgodnie z instrukcjami, aby zresetować hasło. W razie problemów skontaktuj się z naszym biurem obsługi klienta.",
      },
      {
        question: "Jak mogę sprawdzić stan mojego konta?",
        answer: "Stanu swojego konta możesz sprawdzić logując się do bankowości internetowej lub mobilnej. Możesz również skorzystać z naszych bankomatów, aby uzyskać aktualny stan konta lub kontaktując się z naszym biurem obsługi klienta.",
      },
      {
        question: "Czy oferujecie usługi doradztwa finansowego?",
        answer: "Tak, oferujemy usługi doradztwa finansowego. Skontaktuj się z nami, aby umówić się na spotkanie z naszym doradcą finansowym, który pomoże Ci w zarządzaniu finansami i planowaniu przyszłości.",
      },
      {
        question: "Jak mogę złożyć reklamację?",
        answer: "Reklamacje można składać poprzez naszą stronę internetową w sekcji 'Kontakt', telefonicznie lub osobiście w naszej placówce. Postaramy się rozwiązać problem jak najszybciej.",
      },
      {
        question: "Jakie są godziny otwarcia waszych placówek?",
        answer: "Godziny otwarcia naszych placówek różnią się w zależności od lokalizacji. Szczegółowe godziny otwarcia znajdziesz na naszej stronie internetowej w sekcji 'Kontakt' lub kontaktując się z wybraną placówką.",
      },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Tile title="FAQ" className="faq-tile">
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question cursor-pointer font-bold"
              onClick={() => toggleAnswer(index)}
            >
              Q{index + 1}. {item.question}
            </div>
            {activeIndex === index && (
              <div className="faq-answer mt-2 text-gray-700">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </Tile>
  );
};

export default FAQ;
