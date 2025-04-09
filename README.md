### README

# 📦 Hakim Livs API

Detta är backend-API:et för Hakim Livs webbutik. Det tillhandahåller endpoints för autentisering, produkter, kategorier och orderhantering.

## 🌐 Base URL
```
https://<din-domän>/api
```

## 🔐 Autentisering

### POST `/auth/register`
Registrerar en ny användare.

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### POST `/auth/login`
Loggar in användare och returnerar JWT-token.

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### GET `/auth/me` *(skyddad route)*
Returnerar information om inloggad användare (exkl. lösenord).

---

## 🛒 Produkter

### GET `/products`
Returnerar alla produkter.

### GET `/products/bycategory?category=namn`
Returnerar produkter i en viss kategori.

### GET `/products/:id`
Returnerar en produkt baserat på ID.

### POST `/products` *(admin)*
Skapar en ny produkt.

```json
{
  "name": "Mjölk",
  "price": 15,
  "description": "1 liter",
  "stock": 100,
  "category": "<kategori-id>",
  "imageUrl": "http://..."
}
```

### PUT `/products/:id` *(admin)*
Uppdaterar produktinformation.

### DELETE `/products/:id` *(admin)*
Tar bort en produkt.

---

## 📂 Kategorier

### GET `/categories`
Returnerar alla kategorier.

### GET `/categories/:id`
Returnerar specifik kategori.

### POST `/categories` *(admin)*
Skapar ny kategori.

```json
{
  "name": "mejeri"
}
```

### PUT `/categories/:id` *(admin)*
Uppdaterar kategori.

### DELETE `/categories/:id` *(admin)*
Tar bort en kategori.

---

## 📦 Ordrar

### GET `/orders` *(admin)*
Returnerar alla ordrar.

### POST `/orders`
Skapar en ny order.

```json
{
  "user": "<user-id> (valfritt, sätts automatiskt om användare är inloggad)",
  "firstname": "John",
  "lastname": "Doe",
  "phonenumber": "0701234567",
  "email": "john@example.com",
  "products": [
    {
      "productId": "...",
      "name": "Mjölk",
      "price": 15,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "Testvägen",
    "number": "12A",
    "zipCode": "12345",
    "city": "Stockholm"
  }
}
```

### PUT `/orders/:id` *(admin)*
Uppdaterar orderstatus eller information.

Tillåtna statusar:
- `mottagen`
- `behandlas`
- `skickad`
- `levererad`
- `avbruten`

---

## 🔑 Autentisering
För att använda skyddade routes:
```http
Authorization: Bearer <din-token>
```

---

## 📁 Data Migration Endpoints

Används för att importera JSON-data:

- `POST /api/data-migration/products`
- `POST /api/data-migration/categories`

---

## 🛠️ Miljövariabler

Skapa en `.env`-fil med följande:
```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=din-hemliga-nyckel
```

---

## 🧑‍💻 Starta servern
```bash
npm install
npm run dev
```

---

_This API was built with 💚 by Team Hakim Livs_

