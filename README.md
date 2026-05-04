# SuloFUT

1. A program célja

\- A fő cél hogy A felhasználó minél erősebb kártyákat gyűjtsön össze a csapatában a lehető legtöbb összhanggal. Ennek a célnak az elérésére több mód is van a játékon belül, az a felhasználón múlik hogy melyiket/melyikeket használja hogy közelebb jusson a célhoz.

2. Rendszer követelméynek

2.1 Processzor (CPU)

\- Minimum követelmény: Bármilyen modern kétmagos processzor ( Intel Core i3 10. Generáció és felette vagy Amd Ryzen 3)

\- Ajánlott követelmény: Bármilyen négymagos processzor ( Intel Core i5 vagy Amd Ryzen 5)

2.2 Videókártya (CPU)

\- Minimum követelmény: Bármilyen hardver gyorsítást támogató beépített videókártya ( Intel UHD vagy Amd Radeon Graphics)

\- Ajánlott követelmény: Bármilyen modern különálló videókártya (NVIDIA GTX 900-as széria vagy AMD Radeon R9 300-as széria)

2.3 Memória (RAM)

\- Minimum követelmény: 4gb ddr3-as memória

\- Ajánlott követelmény: 8gb ddr4-es memória

2.4 Hálózat és Böngésző

\- Hálózati követelmény: Stabil internet kapcsolat

\- Böngésző minimum követelmény: Chrome 110-es verzió és felette vagy Safari 16-os verzió és felette

\- Böngésző ajánlott követelmény: A legfrisebb chromium alapú böngésző

3. Telepítés

\- Első lépés a XAMPP Control Panel telepítése, amit a következő oldalon tud megtenni: https://www.apachefriends.org/download.html

\- Ha telepítette, a következő lépés hogy meg kell nyitni az alkalmazást tartalmazó mappát egy általunk választott forráskód szerkesztőben (Ebben az esetben Visual Studio Code). Ha használ jelszót a phpMyAdmin felületéhez akkor azt is itt tudja megadni.

\- Második lépés a Node telepítése, amit a következő oldalon tud megtenni: https://nodejs.org/en/download

\- Ezután nyisson meg egy terminált a szerver elindításához

\- Látni fog az oldal alján egy terminál fület, ott a "Split terminal" opciót kell hasznalni

\- A két különböző terminálban a következő két sort kell beírni elsőnek: cd backend, és cd frontend

\- Innentől mindkét terminálban ugyanaz a feladat. Elsőnek az "npm i" vagy "npm install" parancsot kell beírni, megvárja a felhasználó a telepítést, ha ez kész van akkor az "npm run dev" paranccsal tudja el indítani a szervert

\- Ezután nyissa meg a XAMPP Control Panel-t ahol a következő dolgokat kell elindítani: Apache, MySQL, és FileZilla

\- A kövekező lépésnél a phpMyAdmin felületre lesz szükségünk amit a legkönnyebben úgy érhet el, hogy a XAMPP Control Panel felületén a MySQL sorában rányom az admin gombra

\- A phpMyAdmin felületen rá kell nyomni a "New" gombra aztán pedig az "SQL" gombra kattintva be tudjuk illeszteni az adatbázisunkat

\- Másoljuk ki az adatbázis a forráskódban található a database.sql fájlból:

\- Illeszük be a phpMyAdmin oldalára majd nyomjunk rá hogy "Go" vagy "Indítás":

4. Használat

\- Az oldal használatához a felhasználónak egy böngészőre lesz szüksége, a keresősávban a következő link beírásával juthat el az oldalra: <http://127.0.0.1:3001/>

\- Ezt követően a felhasználó regisztálni is tud (Aminek a módját a Fő funkciók ismertetésekor részletesen elmagyarázzuk)
