import enterComments from './enterComment.js';
import getComments from './getComment.js';
import countComments from './countComments.js';

const container = document.getElementById('container');

const popup = async (mId, image, name, genre, language) => {
  const commentData = await getComments(mId);
  const comCount = await countComments(mId);

  // Créer la structure de base du popup
  const commentContainer = document.createElement('div');
  const commentItems = document.createElement('div');
  commentContainer.classList.add('model');
  commentItems.classList.add('cItems');

  // Créer une div pour le contenu des commentaires
  const commentContent = document.createElement('div');
  commentContent.classList.add('comment-content');

  // Image
  const img = document.createElement('img');
  img.classList.add('commentImg');
  img.src = image;
  img.alt = 'Movie poster';

  // Informations du film
  const movieInfo = document.createElement('div');
  movieInfo.classList.add('itemSection');
  movieInfo.innerHTML = `
    <h4>MovieName: ${name}</h4>
    <h4>Language: ${language}</h4>
    <h4>Genre: ${genre.join(', ')}</h4>
  `;

  // Compteur de commentaires
  const cCount = document.createElement('h3');
  cCount.classList.add('cCount');
  cCount.textContent = `Total Comments: ${comCount}`;

  // Section des commentaires
  const dynCom = document.createElement('div');
  dynCom.classList.add('dynCom');

  // Créer la table des commentaires
  const table = document.createElement('table');
  const tableHeader = document.createElement('tr');
  tableHeader.innerHTML = `
    <th>Date</th>
    <th>User</th>
    <th>Comment</th>
  `;
  table.appendChild(tableHeader);

  // Ajouter les commentaires s'ils existent
  if (Array.isArray(commentData) && commentData.length > 0) {
    commentData.forEach((comment) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${comment.creation_date}</td>
        <td>${comment.username}</td>
        <td>${comment.comment}</td>
      `;
      table.appendChild(tr);
    });
  } else {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3" style="text-align: center;">No comments yet</td>';
    table.appendChild(tr);
  }

  dynCom.appendChild(table);

  // Bouton de fermeture
  const cross = document.createElement('i');
  cross.classList.add('close', 'fa', 'fa-close');
  
  // Section de saisie des commentaires
  const inpSect = document.createElement('div');
  inpSect.classList.add('inpSect');
  inpSect.innerHTML = `
    <input type="text" class="inptxt" id="inpIdName" placeholder="Your Name" maxlength="15">
    <input type="text" class="inptxt" id="revId" placeholder="Your Comment" maxlength="30">
    <button id="submitBtn" class="subBtn">Submit</button>
  `;

  // Assembler tous les éléments
  commentItems.appendChild(cross);
  commentItems.appendChild(img);
  commentItems.appendChild(commentContent);
  commentContent.appendChild(movieInfo);
  commentContent.appendChild(cCount);
  commentItems.appendChild(inpSect);
  commentItems.appendChild(dynCom);
  commentContainer.appendChild(commentItems);
  container.appendChild(commentContainer);

  // Gestionnaire de fermeture
  cross.onclick = () => {
    commentContainer.remove();
  };

  // Gestionnaire de soumission des commentaires
  commentContainer.addEventListener('click', async (event) => {
    if (event.target.id === 'submitBtn') {
      const userName = commentContainer.querySelector('#inpIdName');
      const userReview = commentContainer.querySelector('#revId');
      
      if (userName.value && userReview.value) {
        await enterComments(mId, userName.value, userReview.value);
        
        // Réinitialiser les champs
        userName.value = '';
        userReview.value = '';
        
        // Attendre un peu pour la mise à jour
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mettre à jour les commentaires
        const newCommentData = await getComments(mId);
        const newCount = await countComments(mId);
        cCount.textContent = `Total Comments: ${newCount}`;

        // Mettre à jour la table
        table.innerHTML = '';
        table.appendChild(tableHeader);
        
        if (Array.isArray(newCommentData) && newCommentData.length > 0) {
          newCommentData.forEach((comment) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${comment.creation_date}</td>
              <td>${comment.username}</td>
              <td>${comment.comment}</td>
            `;
            table.appendChild(tr);
          });
        }
      }
    }
  });
};

const comments = (id, image, name, genre, language) => {
  popup(id, image, name, genre, language);
};

export default comments;
