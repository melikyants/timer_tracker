import React from "react";

import logo from "./assets/tinyhouse-logo.png";

export const AppHeaderSkeleton = () => {
  return (
    <header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <img src={logo} alt="App logo" />
        </div>
      </div>
    </header>
  );
};
