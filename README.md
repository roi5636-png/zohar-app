# זוהר יחד — הוראות פריסה על Render (חינם)

## מה זה?
מערכת לקריאת ספר הזוהר הקדוש בשיתוף הרבים. שולחים קישור בוואטסאפ, כל אחד מקבל דף, קורא ומאשר.

## פריסה על Render — צעד אחר צעד

### שלב 1: צור חשבון GitHub (אם אין לך)
1. היכנס ל-https://github.com
2. לחץ "Sign up" וצור חשבון חינמי

### שלב 2: העלה את הקוד ל-GitHub
1. לחץ על כפתור "+" בפינה הימנית העליונה ← "New repository"
2. תן שם: `zohar-yachad`
3. סמן "Private" (פרטי)
4. לחץ "Create repository"
5. בדף שנפתח, לחץ "uploading an existing file"
6. גרור את כל הקבצים מתיקיית הפרויקט (לא את התיקייה עצמה — את מה שבתוכה)
7. לחץ "Commit changes"

### שלב 3: צור חשבון Render
1. היכנס ל-https://render.com
2. לחץ "Get Started for Free"
3. התחבר עם חשבון ה-GitHub שלך

### שלב 4: צור שירות חדש ב-Render
1. לחץ "New" ← "Web Service"
2. חבר את ה-repository של `zohar-yachad`
3. מלא את הפרטים:
   - **Name**: `zohar-yachad`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build && npx drizzle-kit push`
   - **Start Command**: `NODE_ENV=production node dist/index.cjs`
   - **Instance Type**: `Free`
4. לחץ "Create Web Service"

### שלב 5: הוסף דיסק (כדי שהנתונים לא יימחקו)
1. אחרי שהשירות נוצר, לך ל-"Disks" בתפריט השמאלי
2. לחץ "Add Disk"
3. **Name**: `zohar-data`
4. **Mount Path**: `/opt/render/project/src`
5. **Size**: `1 GB`
6. לחץ "Save"
7. השירות ייבנה מחדש אוטומטית

### שלב 6: השתמש!
1. Render ייתן לך כתובת כמו: `https://zohar-yachad.onrender.com`
2. היכנס לכתובת, צור קריאה חדשה
3. שלח את הקישור של המשתתפים בוואטסאפ
4. הדשבורד שלך ייגיש דרך החלפת `read` ב-`dashboard` בקישור

## הערות
- בתוכנית החינמית, אם אין תנועה 15 דקות השרת "נרדם". הכניסה הראשונה אחרי זה לוקחת ~30 שניות. אחרי זה הוא מהיר.
- הנתונים נשמרים על הדיסק ולא יימחקו.
- הטקסט של הזוהר נטען מ-Sefaria.org.
- סה"כ 2,097 יחידות קריאה (זוהר + תיקוני זוהר + זוהר חדש).
