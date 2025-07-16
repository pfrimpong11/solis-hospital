// CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Global CSS
declare module '*.css' {}

// SCSS modules
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Global SCSS
declare module '*.scss' {}
