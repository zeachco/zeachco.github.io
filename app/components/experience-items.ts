import {css, html, LitElement} from 'https://cdn.jsdelivr.net/npm/lit-element@4.0.6/+esm'

export class ExperienceItem extends LitElement {
  // static styles = css``;

  static properties = {
    title: {type: String},
  };

  constructor() {
    super();
    this.title = 'Somebody';
  }

  render() {
    return html`
      <div class="mb-6">
        <h3 class="text-xl font-semibold">Senior Fullstack Developer - Tech Innovators Inc.</h3>
        <p class="text-gray-600 dark:text-gray-400">January 2020 - Present</p>
        <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
            <li>Lead development of multiple web applications using React, Node.js, and PostgreSQL</li>
            <li>Implemented microservices architecture to improve scalability and maintainability</li>
            <li>Mentored junior developers and conducted code reviews to ensure best practices</li>
            <li>Optimized application performance, resulting in a 40% reduction in load times</li>
        </ul>
      </div>`;
  }
}

customElements.define('experience-item', ExperienceItem);