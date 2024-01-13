"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styles_module_scss_1 = __importDefault(require("./styles.module.scss"));
exports.default = (positionStyle, header, description, buttonText, href) => `
  <div class="${styles_module_scss_1.default.banner} ${positionStyle}">
    <div class="${styles_module_scss_1.default.bannerBody}">
      <div class="${styles_module_scss_1.default.content}">
        <button class="${styles_module_scss_1.default.dismiss}"></button>
        <div class="${styles_module_scss_1.default.appIcon}">
          <div class="${styles_module_scss_1.default.placeholder}"></div>
          <img class="${styles_module_scss_1.default.image}" alt="${header}">
        </div>
        <div class="${styles_module_scss_1.default.textContainer}">
          <h4 class="${styles_module_scss_1.default.bannerText}">${header}</h4>
          <p class="${styles_module_scss_1.default.bannerText}">${description}</p>
        </div>
        <a class="${styles_module_scss_1.default.action}" href=${href}>${buttonText}</a>
      </div>
    </div>
  </div>`;
//# sourceMappingURL=template.js.map