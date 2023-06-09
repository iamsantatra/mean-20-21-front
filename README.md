# Gestion des devoirs MBDS (front-end MEAN)

## Lien de l'application 
`https://assignment-20-21-front.onrender.com/`

## Membres du groupe

20 - RAJOHNSON Fitahiana Santatry Ny Aina 
<br/>
21 - RAKOTOARISOA Brian Ulrich

## Démarrage du projet

Clonez le projet front-end
`git clone https://github.com/iamsantatra/mean-20-21-front.git`

Utilisez la commande `cd` pour vous rendre dans le répertoire racine de votre projet
`cd mean-20-21-front`

Vérifiez que vous êtes bien dans la branche principale (main) 
`git branch`

Installez les dépendances
`npm install`

Pour démarrer le projet dans un server dev
`ng serve`

Naviguez vers l'url `http://localhost:4200/` depuis votre navigateur pour tester localement le projet.

## Nos contributions

On a utilisé le composant [Angular material](https://material.angular.io/) et un template intitulé [Tivo](https://admin.pixelstrap.com/tivo/template/index.html) pour améliorer l'esthétique du site.

Ce code (back-end et front-end) est basé sur notre projet de l'année dernière, disponible sur GitHub : [E-Kaly](https://github.com/iamsantatra/m1p9mean-santatry-ny-aina), inspiré du tutoriel [AcademindPro MEAN](https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/) ainsi que le site [bezkoder](https://www.bezkoder.com/).

GitHub Copilot et ChatGPT nous ont aussi aidé pour une meilleure productivité.

1. **Authentification**
- Géré avec JWT
- Le formulaire est déjà pré-rempli. 
- Le mot de passe pour tous les utilisateurs est: 12345678
- Dans la barre de navigation (navbar), pour se déconnecter, il suffit de pointer sur le nom et le profil de l'utilisateur, puis de cliquer sur le bouton "Déconnexion".

2. **Inscription**<br/>
On doit renseigner les champs: nom d'utilisateur, profil, photo (convertie en base64 dans la BDD) et un mot de passe.
<br/>

3. **Gestion des devoirs**
- La colonne de gauche contient la liste des devoirs à rendre et la partie de droite contient les devoirs rendus.
- Pour rendre un devoir, il suffit de le déplacer dans la colonne rendu à l'aide d'un mouvement  glisser-déposer (***drag un drop***). Ensuite, une petite fenêtre s'affichera pour renseigner la note et, si nécessaire, ajouter une remarque."
- Par contre, pour annuler le devoir il faut tout simplement remettre le devoir dans la colonne de gauche. Ensuite, une petite fenêtre de confirmation apparaîtra pour confirmer l'annulation.
- Un devoir est représenté dans un élément **card** qui comprend les éléments suivants : le nom du devoir, l'image de la matière, le nom de l'élève, la photo et le nom du professeur, ainsi que la date de rendue.
- Pour rechercher un devoir, il suffit de renseigner le nom.
- La liste est paginée.
- Pour consulter le détail d'un devoir, il suffit de cliquer sur un élément de la liste.
- Pour l'ajout d'un devoir, nous avons utilisé le composant **mat-stepper**. 
- Pour modifier ou supprimer un devoir, il faut cliquer sur le bouton "Modifier" dans la partie détail, ce qui nous redirige vers un formulaire dédié à la modification du devoir.
- Les pages de gestion des devoirs sont contrôlées par **Router Guards**.
- La page de modification/suppression est exclusivement réservée aux professeurs ou administrateurs, et elle est aussi protégée par un système de **Router Guards**.

4. **Hebergement**<br/>
L'application est hebergée sur [render](https://render.com/).