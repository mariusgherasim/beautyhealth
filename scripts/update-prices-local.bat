@echo off
REM Script pentru actualizarea locala a preturilor (springfarma + minuneanaturii),
REM rulat via Windows Task Scheduler. Aceste 2 surse sunt blocate din GitHub
REM Actions (IP de cloud), deci ruleaza doar de aici, de pe calculatorul local.
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

REM --- PASUL 1: commit orice modificari locale INAINTE de pull ---
REM Asta previne eroarea "would be overwritten by merge" si conflictele
REM care duc la markeri <<<<<< in products.json, care strica scriptul.
echo. >> "%LOGFILE%"
echo --- pre-pull: commit modificari locale (daca exista) --- >> "%LOGFILE%"
git add src/data/products.json update-report.json >> "%LOGFILE%" 2>&1
git commit -m "chore: pre-pull - salvare preturi locale inainte de sync" >> "%LOGFILE%" 2>&1

REM --- PASUL 2: pull cu rezolvare automata a conflictelor ---
REM Strategia "ours" = in caz de conflict pe products.json, pastreaza
REM intotdeauna versiunea locala (preturile proaspat scrapate).
echo. >> "%LOGFILE%"
echo --- git pull (cu rezolvare automata conflict) --- >> "%LOGFILE%"
git pull -X ours >> "%LOGFILE%" 2>&1

REM --- PASUL 3: actualizeaza preturile ---
echo. >> "%LOGFILE%"
echo --- npm run update-prices:local --- >> "%LOGFILE%"
set UPDATE_PRICES_PUSH_ON_CHECKPOINT=0
call npm run update-prices:local >> "%LOGFILE%" 2>&1

REM --- PASUL 4: commit + push rezultatele ---
echo. >> "%LOGFILE%"
echo --- git commit + push --- >> "%LOGFILE%"
git add src/data/products.json update-report.json >> "%LOGFILE%" 2>&1
git commit -m "chore: actualizare locala preturi springfarma+minuneanaturii %date%" >> "%LOGFILE%" 2>&1
git push >> "%LOGFILE%" 2>&1
REM Daca push esueaza (branch in urma), face pull+push automat
if %errorlevel% neq 0 (
    echo --- push esuat, incerc pull --no-rebase + push --- >> "%LOGFILE%"
    git pull --no-rebase -X ours >> "%LOGFILE%" 2>&1
    git push >> "%LOGFILE%" 2>&1
)

echo ============================================ >> "%LOGFILE%"
echo Gata - %date% %time% >> "%LOGFILE%"
echo ============================================ >> "%LOGFILE%"
