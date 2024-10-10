import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { UserIconProvider } from './UserIconContext';

// eslint-disable-next-line react/prop-types
const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <UserProvider>
        <AuthProvider>
            <UserIconProvider>
                {/* NAJLEPIEJ BĘDZIE ZAGNIEŻDŻAĆ KONTEKSTY, NARAZIE NIE ZNALAZŁEM LEPSZEGO SPOSOBU */}
                {/* I SZYBKIE SPRAWDZENIE GOOGLE MÓWI, ŻE TO JEST OK */}
                {/* JESZCZE BĘDĘ SZUKAŁ, ALE NARAZIE ZOSTANIE TAK */}
                {/* JAK BĘDZIESZ DAWAŁ SWÓJ KONTEKST TUTAJ TO USUŃ KOMENTARZE */}
                {children}
            </UserIconProvider>
        </AuthProvider>
    </UserProvider>
);

export default ContextProviders;
