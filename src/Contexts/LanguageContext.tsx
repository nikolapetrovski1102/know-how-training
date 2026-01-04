import { createContext, useContext, useState, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  languages: Language[];
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'en';
  });

  const setLanguage = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem('language', code);
    window.location.reload(); // Reload to fetch new language data
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
