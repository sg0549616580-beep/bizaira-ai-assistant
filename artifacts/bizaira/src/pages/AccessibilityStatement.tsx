import { useI18n } from "@/lib/i18n";

const AccessibilityStatement = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold mb-6">{t('accessibility.statement.title', 'הצהרת נגישות')}</h1>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('accessibility.statement.commitment', 'מחויבות לנגישות')}</h2>
          <p className="mb-4">
            {t('accessibility.statement.commitmentText', 'Bizaira AI Assistant מחויבת להנגשת השירות שלה לכלל האוכלוסייה, כולל אנשים עם מוגבלויות. אנו שואפים להבטיח שכל המשתמשים יוכלו לגשת לתכנים ולשירותים שלנו בקלות וביעילות.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('accessibility.statement.standards', 'תקנים ונהלים')}</h2>
          <p className="mb-4">
            {t('accessibility.statement.standardsText', 'האתר הונגש בהתאם לתקן הישראלי 5568 ולתקן הבינלאומי WCAG 2.1 ברמת AA. אנו מבצעים בדיקות שוטפות ומשפרים את הנגישות באופן מתמיד.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('accessibility.statement.features', 'התאמות נגישות')}</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>{t('accessibility.statement.keyboard', 'ניווט מלא באמצעות מקלדת')}</li>
            <li>{t('accessibility.statement.semantic', 'שימוש בתגיות HTML סמנטיות והיררכיית כותרות תקינה')}</li>
            <li>{t('accessibility.statement.alt', 'טקסט חלופי לתמונות')}</li>
            <li>{t('accessibility.statement.contrast', 'יחס ניגודיות מספק בין טקסט לרקע')}</li>
            <li>{t('accessibility.statement.font', 'אפשרות להגדלת טקסט, התאמת מרווחים ושינוי גופן')}</li>
            <li>{t('accessibility.statement.animations', 'עצירת אנימציות ותנועה')}</li>
            <li>{t('accessibility.statement.screenReaders', 'תמיכה בקוראי מסך')}</li>
            <li>{t('accessibility.statement.widget', 'תפריט נגישות מתקדם')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('accessibility.statement.limitations', 'מגבלות נגישות')}</h2>
          <p className="mb-4">
            {t('accessibility.statement.limitationsText', 'אנו פועלים לשיפור מתמיד של הנגישות. במידה ונתקלתם בקושי כלשהו, אנא פנו אלינו ונעשה כל מאמץ לפתור את הבעיה.')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('accessibility.statement.contact', 'יצירת קשר')}</h2>
          <p className="mb-4">
            {t('accessibility.statement.contactText', 'לשאלות או משוב בנושא נגישות, ניתן לפנות אלינו:')}
          </p>
          <address className="not-italic">
            <p><strong>{t('accessibility.statement.name', 'שם:')}</strong> צוות הנגישות של Bizaira</p>
            <p><strong>{t('accessibility.statement.email', 'דוא"ל:')}</strong> <a href="mailto:accessibility@bizaira.com">accessibility@bizaira.com</a></p>
            <p><strong>{t('accessibility.statement.phone', 'טלפון:')}</strong> <a href="tel:+972-123-456789">+972-123-456789</a></p>
          </address>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('accessibility.statement.update', 'עדכון ההצהרה')}</h2>
          <p>
            {t('accessibility.statement.updateText', 'ההצהרה עודכנה לאחרונה בתאריך: 9 באפריל 2026')}
          </p>
        </section>
      </main>
    </div>
  );
};

export default AccessibilityStatement;