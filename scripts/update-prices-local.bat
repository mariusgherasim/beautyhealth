@echo off
REM Script pentru actualizarea locala a preturilor (springfarma + minuneanaturii),
REM rulat via Windows Task Scheduler. Aceste 2 surse sunt blocate din GitHub
REM Actions (IP de cloud), deci ruleaza doar de aici, de pe calculatorul local.
REM
REM IMPORTANT: acest fisier presupune ca folderul de mai jos e deja un clone
REM git conectat la repo-ul de pe GitHub (nu doar fisiere incarcate manual prin
REM interfata web). Vezi REMEMBER.md, sectiunea "Rulare locala programata",
REM pentru pasii de configurare initiala (o singura data).
REM
REM Task Scheduler ruleaza acest script INVIZIBIL, fara fereastra - de-asta tot
REM ce afiseaza scriptul e redirectionat catre un fisier de log, ca sa poata fi
REM verificat ulterior (Task Scheduler nu arata output live).

cd /d "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"

if not exist "logs" mkdir "logs"
set LOGFILE=logs\update-prices-local.log

echo ============================================ >> "%LOGFILE%"
echo Actualizare preturi locala - %date% %time% >> "%LOGFILE%"
echo ============================================ >> "%LOGFILE%"

echo. >> "%LOGFILE%"
echo --- git pull --- >> "%LOGFILE%"
git pull >> "%LOGFILE%" 2>&1

echo. >> "%LOGFILE%"
echo --- npm run update-prices:local (cu push automat la checkpoint) --- >> "%LOGFILE%"
set UPDATE_PRICES_PUSH_ON_CHECKPOINT=1
call npm run update-prices:local >> "%LOGFILE%" 2>&1

echo. >> "%LOGFILE%"
echo --- git commit + push --- >> "%LOGFILE%"
git add src/data/products.json update-report.json >> "%LOGFILE%" 2>&1
git commit -m "chore: actualizare locala preturi springfarma+minuneanaturii %date%" >> "%LOGFILE%" 2>&1
git push >> "%LOGFILE%" 2>&1

echo ============================================ >> "%LOGFILE%"
echo Gata - %date% %time% >> "%LOGFILE%"
echo ============================================ >> "%LOGFILE%"
