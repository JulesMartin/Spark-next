// Indicatifs des pays francophones, France en tête (sélection par défaut).
export type PhoneCountry = {
  name: string
  iso: string
  dial: string
  flag: string
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: 'France', iso: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Belgique', iso: 'BE', dial: '+32', flag: '🇧🇪' },
  { name: 'Suisse', iso: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Canada', iso: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Luxembourg', iso: 'LU', dial: '+352', flag: '🇱🇺' },
  { name: 'Monaco', iso: 'MC', dial: '+377', flag: '🇲🇨' },
  { name: 'Maroc', iso: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Algérie', iso: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Tunisie', iso: 'TN', dial: '+216', flag: '🇹🇳' },
  { name: 'Sénégal', iso: 'SN', dial: '+221', flag: '🇸🇳' },
  { name: "Côte d'Ivoire", iso: 'CI', dial: '+225', flag: '🇨🇮' },
  { name: 'Mali', iso: 'ML', dial: '+223', flag: '🇲🇱' },
  { name: 'Cameroun', iso: 'CM', dial: '+237', flag: '🇨🇲' },
  { name: 'Bénin', iso: 'BJ', dial: '+229', flag: '🇧🇯' },
  { name: 'Togo', iso: 'TG', dial: '+228', flag: '🇹🇬' },
  { name: 'Burkina Faso', iso: 'BF', dial: '+226', flag: '🇧🇫' },
  { name: 'Niger', iso: 'NE', dial: '+227', flag: '🇳🇪' },
  { name: 'Guinée', iso: 'GN', dial: '+224', flag: '🇬🇳' },
  { name: 'Gabon', iso: 'GA', dial: '+241', flag: '🇬🇦' },
  { name: 'République démocratique du Congo', iso: 'CD', dial: '+243', flag: '🇨🇩' },
  { name: 'Congo-Brazzaville', iso: 'CG', dial: '+242', flag: '🇨🇬' },
  { name: 'Madagascar', iso: 'MG', dial: '+261', flag: '🇲🇬' },
  { name: 'Tchad', iso: 'TD', dial: '+235', flag: '🇹🇩' },
  { name: 'Djibouti', iso: 'DJ', dial: '+253', flag: '🇩🇯' },
  { name: 'Rwanda', iso: 'RW', dial: '+250', flag: '🇷🇼' },
  { name: 'Burundi', iso: 'BI', dial: '+257', flag: '🇧🇮' },
  { name: 'Comores', iso: 'KM', dial: '+269', flag: '🇰🇲' },
  { name: 'Haïti', iso: 'HT', dial: '+509', flag: '🇭🇹' },
]

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0]
