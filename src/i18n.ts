import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { invoice: "Invoice", tracking: "Tracking ID", amount: "Amount to Charge", actualWeight: "Total Actual Weight", volumetricWeight: "Total Volumetric Weight" } },
    fr: { translation: { invoice: "Facture", tracking: "ID de suivi", amount: "Montant à facturer", actualWeight: "Poids réel total", volumetricWeight: "Poids volumétrique total" } },
    es: { translation: { invoice: "Factura", tracking: "ID de seguimiento", amount: "Importe a cobrar", actualWeight: "Peso real total", volumetricWeight: "Peso volumétrico total" } },
    de: { translation: { invoice: "Rechnung", tracking: "Sendungsverfolgungs-ID", amount: "Zu berechnender Betrag", actualWeight: "Gesamtgewicht", volumetricWeight: "Gesamtvolumengewicht" } },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
