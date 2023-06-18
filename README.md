# Gestion de devoir MBDS (front-end MEAN)

## Lien de l'application 
`https://mean-20-21-front.onrender.com`

## Membres du groupe

20 - RAJOHNSON Fitahiana Santatry Ny Aina 
21 - RAKOTOARISOA Brian Ulrich

## Démarrage du projet

Clonez le projet front-end
`git clone https://github.com/iamsantatra/mean-20-21-front.git`

Vérifiez que vous êtes bien dans la branche principale (main)   
`git branch`

Installez les dépendances
`npm install`

Pour démarrer le projet dans un server dev
`ng serve`

Naviguez vers l'url `http://localhost:4200/` depuis votre navigateur pour tester localement le projet.

## Nos contributions

On a utilisé le composant [Angular material](https://material.angular.io/) et un template intitulé [Tivo](https://admin.pixelstrap.com/tivo/template/index.html) pour améliorer l'esthétique du site.

Notre code (back-end et front-end) est basé sur notre projet de l'année dernière, disponible sur : `https://github.com/iamsantatra/m1p9mean-santatry-ny-aina` qui est inspiré de ce tutoriel `https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/` ainsi que par le site `https://www.bezkoder.com/`.

GitHub Copilot et ChatGPT nous ont aussi aidé pour une meilleure productivité.

1. **Authentification**
- Géré avec JWT
- Le formulaire est déjà pré-rempli. 
- Le mot de passe pour tous les utilisateurs est: 12345678

2. **Inscription**
On doit renseigner les champs: nom d'utilisateur, profil, photo (convertie en base64 dans la BDD) et un mot de passe.
<br/>
3. **Gestion des devoirs**
- La colonne de gauche contient la liste des devoirs à rendre et la partie de droite contient les devoirs rendus.
- Pour rendre un devoir, il suffit de le déplacer dans la colonne rendu à l'aide d'un mouvement  glisser-déposer (***drag un drop***). Ensuite, une petite fenêtre s'affichera pour renseigner la note et, si nécessaire, ajouter une remarque."
- Par contre, pour annuler le devoir il faut tout simplement remettre le devoir dans la colonne de gauche. Ensuite, une petite fenêtre de confirmation apparaîtra pour confirmer l'annulation.
- Un devoir est représenté dans un **card** contenant: le nom, l'image de la matière, le nom de l'élève, la photo du prof et son nom et la date de soumission.
- Pour rechercher un devoir, il suffit de renseigner le nom.
- La liste est paginée.
- Pour consulter les détails d'un devoir, il suffit de cliquer sur un élément de la liste.
- Pour l'ajout d'un devoir, nous avons utilisé le composant **mat-stepper**. 

