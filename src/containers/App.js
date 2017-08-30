import React from 'react';

const App = () => {
  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Oh Hi!</h1>
          <h2 className="subtitle">This is my github.</h2>
          <p>
            This project autobuild with Travis 2<br />
            <img src="//travis-ci.org/zeachco/zeachco.github.io.svg?branch=master" alt="Travis status badge" />
          </p>
        </div>
      </div>
    </section>
  );
};

export default App;
