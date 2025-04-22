# 🧭 API Adresses & Risques — Projet NestJS + TypeORM

## 🛠️ Objectif

Cette API permet :

- D’enregistrer une adresse en base de données à partir de l’API BAN.
- De consulter les risques naturels associés à cette adresse via l’API Géorisques.

Développée avec **NestJS**, **TypeORM (SQLite)**, et entièrement **Dockerisée**.

---

## 🚀 Lancement du projet

### 📦 Prérequis

- Docker & Docker Compose installés

### ▶️ Démarrage en 4 commandes

```bash
git clone https://github.com/ange980/Test_klaire.git
cd Test_klaire
docker compose build
docker compose up
```

## ⚙️ Variables d’environnement

Fichier `.env` ou configuration automatique dans Docker :

```env
TYPEORM_CONNECTION=sqlite
TYPEORM_DATABASE=/data/db.sqlite
```

## 📌 Endpoints disponibles

### 📍 POST /api/addresses/

Enregistrer une adresse à partir d’une recherche

📤 Requête

```txt
POST http://localhost:8000/api/addresses?q=8+bd+du+port
```

✅ Réponse 200

```json
{
  "id": 1,
  "label": "8 bd du Port, 56170 Sarzeau",
  "housenumber": "8",
  "street": "bd du Port",
  "postcode": "56170",
  "citycode": "56242",
  "latitude": 47.58234,
  "longitude": -2.73745
}
```

❌ Réponses erreur

400 Bad Request (q n'est pas renseigné)

```json
{ "error": "Le champ 'q' est requis et doit être une chaîne non vide." }
```

404 Not Found (aucun résultat correspondant)

```json
{
  "error": "Adresse non trouvée. Aucun résultat ne correspond à votre recherche."
}
```

500 Internal Server Error

```json
{ "error": "Erreur serveur : impossible de contacter l'API externe." }
```

## 🌍 GET /api/addresses/{id}/risks/

Consulter les risques associés à une adresse

GET http://localhost:8000/api/addresses/2/risks

✅ Réponse 200

```json
{ {
  "adresse": {
    "libelle": "14 Rue des Papangues 97480 Saint-Joseph",
    "longitude": 55.669785,
    "latitude": -21.37073
  },
  "commune": {
    "libelle": "Saint-Joseph",
    "codePostal": "97480",
    "codeInsee": "97412"
  },
  "url": "https://georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi/rapport2?typeForm=adresse&city=Saint-Joseph&codeInsee=97412&lon=55.669786&lat=-21.370729&adresse=14+Rue+des+Papangues+97480+Saint-Joseph",
  "risquesNaturels": {
    "inondation": {
      "present": false,
      "libelle": "Inondation"
    },
    "risqueCotier": {
      "present": false,
      "libelle": "Risques côtiers (submersion marine, tsunami)"
    },
    "seisme": {
      "present": true,
      "libelle": "Séisme"
    },
    "mouvementTerrain": {
      "present": true,
      "libelle": "Mouvements de terrain"
    },
    "reculTraitCote": {
      "present": false,
      "libelle": "Recul du trait de côte"
    },
    "retraitGonflementArgile": {
      "present": false,
      "libelle": "Retrait gonflement des argiles"
    },
    "avalanche": {
      "present": false,
      "libelle": "Avalanche"
    },
    "feuForet": {
      "present": true,
      "libelle": "Feu de forêt"
    },
    "eruptionVolcanique": {
      "present": true,
      "libelle": "Volcan"
    },
    "cyclone": {
      "present": true,
      "libelle": "Vent violent"
    },
    "radon": {
      "present": true,
      "libelle": "Radon"
    }
  },
  "risquesTechnologiques": {
    "icpe": {
      "present": false,
      "libelle": "Installations industrielles classées (ICPE)"
    },
    "nucleaire": {
      "present": false,
      "libelle": "Nucléaire"
    },
    "canalisationsMatieresDangereuses": {
      "present": false,
      "libelle": "Canalisations de transport de matières dangereuses"
    },
    "pollutionSols": {
      "present": true,
      "libelle": "Pollution des sols"
    },
    "ruptureBarrage": {
      "present": false,
      "libelle": "Rupture de barrage"
    },
    "risqueMinier": {
      "present": false,
      "libelle": "Risques miniers"
    }
  }
} }

```

404 Not Found

```json
{ "error": "Adresse non trouvée." }
```

500 Internal Server Error

```json
{
  "error": "Erreur serveur : échec de la récupération des données de Géorisques."
}
```

## 🧪 Tests

Lancer les tests unitaires avec :

```bash
docker compose exec app npm run test
```

Les tests sont disponibles dans le dossier **tests**/ et couvrent les cas principaux des endpoints.

## 🗃️ Structure du projet

```txt
src/
├── address/
│ ├── address.controller.ts
│ ├── address.service.ts
│ ├── address.entity.ts
│ └── address.module.ts
├── app.module.ts
├── main.ts
└── ...
```

## 🐳 Docker

Serveur Node exposé sur le port 8000

Base SQLite montée sur un volume /data/db.sqlite

Voir le fichier docker-compose.yml pour plus de détails
