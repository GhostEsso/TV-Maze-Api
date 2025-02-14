import getMovie from './getMovie.js';
import { countLikes, updateLikesCount } from './countsLike.js';
import comments from './comments.js';
import getLikes from './getLikes.js';

const container = document.getElementById('container');

const display = async () => {
  try {
    const likesData = await getLikes();
    const getMovieData = await getMovie();
    container.classList.add('movies-container');

    const totalLikesPerMovie = likesData.reduce((acc, likes) => {
      acc[likes.item_id] = (acc[likes.item_id] || 0) + likes.likes;
      return acc;
    }, {});

    const cardscounter = () => {
      const cardNum = document.querySelector('#cardNum');
      const cards = document.querySelectorAll('.movie');
      cardNum.innerHTML = `Shows(${cards.length})`;
    };

    container.innerHTML = ''; // Clear the container before adding new elements

    getMovieData.forEach((element) => {
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie');

      const img = document.createElement('img');
      const p = document.createElement('p');
      const a = document.createElement('a');
      const heartIcon = document.createElement('i');
      const countsLike = document.createElement('span');
      const heartCount = document.createElement('section');

      a.classList.add('anc');
      p.textContent = element.name;
      a.textContent = 'comments';
      a.href = '#';
      img.src = element.image.original;
      img.alt = 'No image found';
      img.width = 200;
      img.height = 300;

      heartIcon.classList.add('far', 'fa-heart');
      if (totalLikesPerMovie[element.id] > 0) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.classList.add('liked');
      }
      heartIcon.setAttribute('data-item-id', element.id);

      heartIcon.addEventListener('click', async (event) => {
        const itemId = event.target.getAttribute('data-item-id');

        event.target.classList.remove('far');
        event.target.classList.add('fas', 'liked');

        let likesInfo = likesData.find((likes) => likes.item_id === itemId);

        if (!likesInfo) {
          likesInfo = { item_id: itemId, likes: 0 };
        }

        const newLikesCount = likesInfo.likes + 1;

        await countLikes(itemId, newLikesCount);
        updateLikesCount(itemId, newLikesCount);

        totalLikesPerMovie[itemId] = newLikesCount;
        display();
      });

      countsLike.classList.add('add');
      countsLike.textContent = totalLikesPerMovie[element.id] || 0;
      movieDiv.appendChild(img);

      const sect = document.createElement('section');
      sect.appendChild(p);
      sect.appendChild(a);
      movieDiv.appendChild(sect);

      heartCount.appendChild(countsLike);
      heartCount.appendChild(heartIcon);
      movieDiv.appendChild(heartCount);

      sect.classList.add('sect');
      container.appendChild(movieDiv);

      a.addEventListener('click', () => {
        comments(element.id, element.image.original, element.name,
          element.genres, element.language);
      });
    });
    cardscounter();
  } catch (error) {
    console.log('Une erreur s\'est produite lors de l\'affichage des films', error);
  }
};

export default display;
