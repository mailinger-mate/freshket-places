/**
 * @typedef Tag
 * @type {object}
 * @property {number} id ID
 * @property {string} name Name
 * @property {'Earth' | 'Air' | 'Fire' | 'Water'} type Type
 *//**
 * @typedef Place
 * @type {object}
 * @property {string} name Name
 * @property {string} img_url Image URL
 * @property {string} body Description
 * @property {number[]} tags Tag IDs
 */
class PlaceList extends HTMLElement {
  /** @type {Promise<Place[]>} */
  places = window.fetch('https://gist.githubusercontent.com/knot-freshket/142c21c3e8e54ef36e33f5dc6cf54077/raw/94ebab16839484f06d42eb799e30d0a945ff1a1b/freshket-places.json', { cache: "force-cache" }).then(response => response.json());
  /** @type {Promise<Tag[]>} */
  tags = window.fetch('https://gist.githubusercontent.com/knot-freshket/fa49e0a5c6100d50db781f28486324d2/raw/55bc966f54423dc73384b860a305e1b67e0bfd7d/freshket-tags.json', { cache: "force-cache" }).then(response => response.json());
  ul = document.createElement('ul');

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.ul.part = 'list';
    this.shadowRoot.appendChild(this.ul);
  }
  
  async connectedCallback() {
    const places = await this.places;
    const tags = await this.tags;

    for (const place of places) {
      const li = document.createElement('li');
      const article = document.createElement('article');
      const h1 = document.createElement('h1');
      const img = document.createElement('img');
      const p = document.createElement('p');
      const ul = document.createElement('ul');

      li.part = 'item';

      h1.textContent = place.name;
      h1.part = 'title';

      img.src = place.img_url;
      img.loading = 'lazy';
      img.part = 'image';

      p.textContent = place.body;
      p.part = 'body';

      ul.part = 'tags';
      for (const id of place.tags) {
        const tag = tags.find(tag => tag.id === id);
        if (!tag) continue;
        const li = document.createElement('li');
        li.textContent = tag.name;
        li.part = `tag ${tag.type}`;
        ul.appendChild(li);
      }

      article.append(
        img,
        h1,
        p,
        ul,
      );
      li.appendChild(article);
      this.ul.appendChild(li);
    }
  }
}

customElements.define('place-list', PlaceList);