export default function ListCard({ list, children }) {
    const previews = list.tasks.slice(0, 3);
    return (
      <article>
        <h3>{list.name}</h3>
        <ul>
          {previews.map(t => (
            <li key={t.id}>
              <input type="checkbox" readOnly checked={t.done} />
              <span>{t.title}</span>
            </li>
          ))}
        </ul>
        {children}
      </article>
    );
  }  