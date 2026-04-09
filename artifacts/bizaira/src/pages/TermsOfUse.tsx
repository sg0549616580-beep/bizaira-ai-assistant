import { useI18n } from "@/lib/i18n";

const TermsOfUse = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold mb-6">{t('terms.title', 'תנאי שימוש')}</h1>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.acceptance', 'קבלה של התנאים')}</h2>
          <p className="mb-4">
            {t('terms.acceptanceText', 'על ידי גישה לאתר Bizaira AI Assistant והשימוש בו, אתם מסכימים להיות כפופים לתנאי השימוש הללו. אם אינכם מסכימים לתנאים אלה, אנא אל תשתמשו באתר.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.services', 'תיאור השירותים')}</h2>
          <p className="mb-4">
            {t('terms.servicesText', 'Bizaira AI Assistant מספק כלים מבוססי בינה מלאכותית ליצירת תוכן שיווקי, תמונות וניתוח עסקי. השירותים כפופים לתנאים אלה ולמדיניות הפרטיות שלנו.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.usage', 'שימוש מותר')}</h2>
          <p className="mb-4">
            {t('terms.usageText', 'אתם רשאים להשתמש באתר למטרות חוקיות בלבד. אסור לכם להשתמש באתר כדי להפר זכויות של אחרים, להפיץ תוכן לא חוקי או לפגוע בתפקוד האתר.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.account', 'חשבון משתמש')}</h2>
          <p className="mb-4">
            {t('terms.accountText', 'בעת הרשמה לאתר, אתם מספקים מידע מדויק ומלא. אתם אחראים לשמירה על סודיות הסיסמה שלכם ולכל הפעילות המתבצעת בחשבון שלכם.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.intellectual', 'זכויות קניין רוחני')}</h2>
          <p className="mb-4">
            {t('terms.intellectualText', 'כל התוכן והשירותים באתר מוגנים בזכויות יוצרים ובקניין רוחני. אתם רשאים להשתמש בתוכן שנוצר באמצעות השירותים למטרות מסחריות, אך לא להעתיק או להפיץ את התוכנה עצמה.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.disclaimer', 'הצהרת אחריות')}</h2>
          <p className="mb-4">
            {t('terms.disclaimerText', 'השירותים מסופקים "כפי שהם" ללא אחריות מכל סוג. אנו לא מתחייבים לתוצאות ספציפיות או לזמינות מתמדת של השירות.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.limitation', 'הגבלת אחריות')}</h2>
          <p className="mb-4">
            {t('terms.limitationText', 'בשום מקרה לא נהיה אחראים לנזקים ישירים, עקיפים או מיוחדים הנובעים משימוש באתר או בשירותים.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('terms.contact', 'יצירת קשר')}</h2>
          <p className="mb-4">
            {t('terms.contactText', 'לשאלות בנושא תנאי השימוש, ניתן לפנות אלינו:')}
          </p>
          <address className="not-italic">
            <p><strong>{t('terms.email', 'אימייל:')}</strong> legal@bizaira.com</p>
            <p><strong>{t('terms.phone', 'טלפון:')}</strong> +972-123-456789</p>
          </address>
        </section>
      </main>
    </div>
  );
};

export default TermsOfUse;