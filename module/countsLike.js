const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/s1szyoelhRqTHhs2c19P/likes/';

const countLikes = async (itemId, newLikesCount) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        item_id: itemId,
        likes: newLikesCount,
      }),
    });

    if (!response.ok) {
      throw new Error('Error counting likes');
    }
  } catch (error) {
    console.error('Error counting likes:', error.message);
  }
};

const updateLikesCount = (itemId, newLikesCount) => {
  const heartIcon = document.querySelector(`[data-item-id="${itemId}"]`);
  const countsLike = heartIcon.parentElement.querySelector('.add');
  
  if (countsLike && heartIcon) {
    // Mettre à jour le compteur
    countsLike.textContent = newLikesCount;
    countsLike.classList.add('increment');
    
    // Ajouter la classe liked au cœur
    heartIcon.classList.add('liked');
    
    // Animer le conteneur
    const heartCount = heartIcon.parentElement;
    heartCount.style.borderColor = 'var(--error-color)';
    
    // Retirer les classes d'animation après un délai
    setTimeout(() => {
      countsLike.classList.remove('increment');
    }, 300);
  }
};

export { countLikes, updateLikesCount };
