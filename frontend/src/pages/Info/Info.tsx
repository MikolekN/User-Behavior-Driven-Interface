import Tile from "../../components/Tile/Tile";
import { useTranslation } from "react-i18next";

const Info = () => {
  const { t } = useTranslation();

  return (
    <Tile id="info" title={t("contact.tile.title")}>
        <div className="flex flex-col gap-4">
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800">
                <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-300">{t("contact.phoneContact.title")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("contact.phoneContact.message")}:</p>
                <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-400">
                    <li><strong>{t("contact.phoneContact.hotline")}:</strong> +48 123 456 789</li>
                    <li><strong>{t("contact.phoneContact.customerService")}:</strong> +48 987 654 321</li>
                    <li><strong>{t("contact.phoneContact.technicalSupport")}:</strong> +48 555 666 777</li>
                </ul>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800">
                <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-300">{t("contact.emailContact.title")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("contact.emailContact.message")}:</p>
                <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-400">
                    <li><strong>{t("contact.emailContact.email")}:</strong> kontakt@naszbank.pl</li>
                    <li><strong>{t("contact.emailContact.complaint")}:</strong> reklamacje@naszbank.pl</li>
                    <li><strong>{t("contact.emailContact.technicalSupport")}:</strong> wsparcie@naszbank.pl</li>
                </ul>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800">
                <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-300">{t("contact.address.title")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("contact.address.message")}:</p>
                <address className="mt-2 text-gray-700 dark:text-gray-400">
                    ul. Bankowa 1<br />
                    00-001 Warszawa, Polska
                </address>
            </div>
        </div>
    </Tile>
  );
};

export default Info;
