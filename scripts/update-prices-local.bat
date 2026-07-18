@echo off
REM Script pentru actualizarea locala a preturilor (springfarma + minuneanaturii),
REM rulat via Windows Task Scheduler. Aceste 2 surse sunt blocate din GitHub
REM Actions (IP de cloud), deci ruleaza doar de aici, de pe calculatorul local.
REM
REM IMPORTANT: acest fisier presupune ca folderul de mai jos e deja un clone
REM git conectat la repo-ul de pe GitHub (nu doar fisiere incarcate manual prin
REM interfata web). Vezi REMEMBER.md, sectiunea "Rulare locala programata",
REM pentru pasii de configurare initiala (o singura data).

cd /d "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"

echo ============================================
echo Actualizare preturi locala - %date% %time%
echo ============================================

git pull

call npm run update-prices:local

git add src/data/products.json update-report.json
git commit -m "chore: actualizare locala preturi springfarma+minuneanaturii %date%"
git push

echo ============================================
echo Gata.
echo ============================================
