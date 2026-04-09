import { useI18n } from "@/lib/i18n";

const PrivacyPolicy = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold mb-6">{t('privacy.title', 'מדיניות הפרטיות')}</h1>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.introduction', 'מבוא')}</h2>
          <p className="mb-4">
            {t('privacy.introText', 'ברוכים הבאים למדיניות הפרטיות של Bizaira AI Assistant. אנו מחויבים להגן על הפרטיות והמידע האישי שלכם. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם כאשר אתם משתמשים בשירותינו.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.collection', 'איסוף מידע')}</h2>
          <p className="mb-4">
            {t('privacy.collectionText', 'אנו אוספים מידע שאתם מספקים לנו ישירות, כגון שם, כתובת אימייל וסיסמה בעת הרשמה. כמו כן, אנו אוספים מידע על השימוש שלכם באתר באמצעות עוגיות וכלים אנליטיים.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.usage', 'שימוש במידע')}</h2>
          <p className="mb-4">
            {t('privacy.usageText', 'המידע שלכם משמש לספק את השירותים, לשפר את החוויה, לתקשר עמכם ולעמוד בדרישות החוק. אנו לא מוכרים או משכירים את המידע שלכם לצדדים שלישיים.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.cookies', 'עוגיות')}</h2>
          <p className="mb-4">
            {t('privacy.cookiesText', 'אנו משתמשים בעוגיות כדי לשפר את חוויית המשתמש, לזכור את ההעדפות שלכם ולספק תוכן מותאם. יש לכם אפשרות לשלוט בעוגיות דרך הגדרות הדפדפן או תפריט הנגישות שלנו.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.security', 'אבטחה')}</h2>
          <p className="mb-4">
            {t('privacy.securityText', 'אנו מיישמים אמצעי אבטחה מתקדמים כדי להגן על המידע שלכם, כולל הצפנה וגישה מוגבלת. עם זאת, אין שיטת העברה באינטרנט בטוחה לחלוטין.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.rights', 'זכויותיכם')}</h2>
          <p className="mb-4">
            {t('privacy.rightsText', 'יש לכם זכות לגשת למידע שלכם, לתקנו, למחקו או להגביל את עיבודו. תוכלו לעשות זאת על ידי פנייה אלינו בכתובת המייל המפורטת למטה.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact', 'יצירת קשר')}</h2>
          <p className="mb-4">
            {t('privacy.contactText', 'לשאלות בנושא מדיניות הפרטיות, ניתן לפנות אלינו:')}
          </p>
          <address className="not-italic">
            <p><strong>{t('privacy.email', 'אימייל:')}</strong> privacy@bizaira.com</p>
            <p><strong>{t('privacy.phone', 'טלפון:')}</strong> +972-123-456789</p>
          </address>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;