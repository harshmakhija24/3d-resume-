const front = document.querySelector('#frontLeaflet');
const back = document.querySelector('#backLeaflet');
const controls = document.querySelectorAll('[data-side]');

function showSide(side) {
  const frontActive = side === 'front';
  front.classList.toggle('is-hidden', !frontActive);
  back.classList.toggle('is-hidden', frontActive);
  controls.forEach((button) => button.classList.toggle('is-active', button.dataset.side === side));
}

controls.forEach((button) => button.addEventListener('click', () => showSide(button.dataset.side)));

document.querySelector('#printLeaflet').addEventListener('click', () => {
  const pair = document.querySelector('#printPair');
  pair.replaceChildren(front.cloneNode(true), back.cloneNode(true));
  pair.querySelectorAll('.is-hidden').forEach((node) => node.classList.remove('is-hidden'));
  window.print();
});
