import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ShapeAttributes } from './ShapeAttributes';

export class AngularExporter {
 /*    private zip: JSZip;
    private projectName; */

    constructor(projectName = 'my-angular-design') {
        this.zip = new JSZip();
        this.projectName = projectName;
    }

    /**
     * Exporta los diseños a un proyecto Angular
     */
    async exportToAngular(shapes) {
        // Crear estructura básica del proyecto
        this.generateProjectStructure();

        // Generar archivos del componente principal
        this.generateMainComponent(shapes);

        // Generar archivos de configuración
        this.generateConfigFiles(
        );

        // Generar README
        this.generateReadme();

        // Crear y descargar el ZIP
        const content = await this.zip.generateAsync({ type: "blob" });
        saveAs(content, `${this.projectName}.zip`);
    }

    /**
     * Crea la estructura básica del proyecto Angular
     */
    generateProjectStructure() {
        const folders = [
            'src/app',
            'src/app/components',
            'src/app/services',
            'src/assets',
            'src/environments'
        ];

        folders.forEach(folder => {
            this.zip.folder(folder);
        });
    }

    /**
     * Genera el componente principal con el diseño
     */
    generateMainComponent(shapes) {
        const componentFolder = this.zip.folder('src/app/components/design');

        if (!componentFolder) {
            throw new Error('No se pudo crear la carpeta del componente');
        }

        // Generar HTML
        componentFolder.file('design.component.html', this.generateTemplate(shapes));

        // Generar CSS
        componentFolder.file('design.component.scss', this.generateStyles(shapes));

        // Generar TypeScript
        componentFolder.file('design.component.ts', this.generateComponent());
    }

    /**
     * Genera el template HTML basado en las figuras
     */
    generateTemplate(shapes ) {
        let template = '<div class="design-container">\n';

        shapes.forEach(shape => {
            const id = shape.id.replace(/[^a-zA-Z0-9]/g, '');
            template += `  <div id="${id}" class="shape ${shape.type}-shape">\n`;

            switch (shape.type) {
                case 'text':
                    template += `    <span>${shape.text || ''}</span>\n`;
                    break;
                case 'image':
                    template += `    <img src="assets/images/${id}.png" alt="design-image" />\n`;
                    break;
                // Los demás tipos se manejan con CSS
            }

            template += `  </div>\n`;
        });

        template += '</div>';
        return template;
    }

    /**
     * Genera los estilos CSS para todas las figuras
     */
    generateStyles(shapes) {
        let styles = `.design-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}\n\n`;

        styles += `.shape {
  position: absolute;
  transform-origin: center;
}\n\n`;

        shapes.forEach(shape => {
            const id = shape.id.replace(/[^a-zA-Z0-9]/g, '');
            styles += this.generateShapeStyle(shape, id);
        });

        return styles;
    }

    /**
     * Genera los estilos específicos para cada figura
     */
    generateShapeStyle(shape, id) {
        let style = `#${id} {\n`;
        style += `  left: ${shape.x}px;\n`;
        style += `  top: ${shape.y}px;\n`;
        style += `  width: ${shape.width}px;\n`;
        style += `  height: ${shape.height}px;\n`;

        if (shape.rotation) {
            style += `  transform: rotate(${shape.rotation}deg);\n`;
        }

        switch (shape.type) {
            case 'rectangle':
                style += `  background-color: ${shape.fill || '#ffffff'};\n`;
                style += `  border: ${shape.strokeWidth}px solid ${shape.stroke || '#000000'};\n`;
                break;
            case 'circle':
                style += `  border-radius: 50%;\n`;
                style += `  background-color: ${shape.fill || '#ffffff'};\n`;
                style += `  border: ${shape.strokeWidth}px solid ${shape.stroke || '#000000'};\n`;
                break;
            // ... más casos para otros tipos
        }

        style += `}\n\n`;
        return style;
    }

    /**
     * Genera el archivo component.ts
     */
    generateComponent() {
        return `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}`;
    }

    /**
     * Genera archivos de configuración necesarios
     */
    generateConfigFiles() {
        // Archivos de configuración principales
        this.zip.file('package.json', this.generatePackageJson());
        this.zip.file('angular.json', this.generateAngularJson());
        this.zip.file('tsconfig.json', this.generateTsConfig());
        this.zip.file('tsconfig.app.json', this.generateTsConfigApp());
        this.zip.file('README.md', this.generateReadme());

        // Archivos principales de la aplicación
        const srcFolder = this.zip.folder('src');
        if (srcFolder) {
            srcFolder.file('index.html', this.generateIndexHtml());
            srcFolder.file('main.ts', this.generateMainTs());
            srcFolder.file('styles.scss', this.generateGlobalStyles());

            // Archivos de la aplicación
            const appFolder = srcFolder.folder('app');
            if (appFolder) {
                appFolder.file('app.module.ts', this.generateAppModule());
                appFolder.file('app.component.ts', this.generateAppComponent());
                appFolder.file('app.component.html', this.generateAppComponentHtml());
                appFolder.file('app.component.scss', this.generateAppComponentScss());
            }

            // Archivos de ambiente
            const environmentsFolder = srcFolder.folder('environments');
            if (environmentsFolder) {
                environmentsFolder.file('environment.ts', this.generateEnvironment(false));
                environmentsFolder.file('environment.prod.ts', this.generateEnvironment(true));
            }
        }
    }

    /**
     * Genera el README con instrucciones
     */
    generateReadme() {
        const readme = `# ${this.projectName}

Este proyecto fue generado automáticamente a partir de un diseño en el Graficador.

## Requisitos previos

1. Node.js (versión 14 o superior)
2. Angular CLI: \`npm install -g @angular/cli\`

## Pasos para ejecutar el proyecto

1. Descomprime el archivo ZIP
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta \`npm install\` para instalar las dependencias
4. Ejecuta \`ng serve\` para iniciar el servidor de desarrollo
5. Navega a \`http://localhost:4200/\` en tu navegador

## Estructura del proyecto

- \`src/app/components/design/\`: Contiene el componente principal con el diseño
- \`src/assets/\`: Contiene las imágenes y recursos utilizados
- \`src/styles.scss\`: Estilos globales

## Personalización

Puedes modificar los estilos en:
- \`src/app/components/design/design.component.scss\`

## Soporte

Para problemas o preguntas, por favor crea un issue en el repositorio original.`;

        this.zip.file('README.md', readme);
    }


    /**
   * Genera el archivo package.json con las dependencias necesarias
   */
    generatePackageJson() {
        const packageJson = {
            name: this.projectName,
            version: "0.0.1",
            scripts: {
                ng: "ng",
                start: "ng serve",
                build: "ng build",
                watch: "ng build --watch --configuration development",
                test: "ng test"
            },
            private: true,
            dependencies: {
                "@angular/animations": "^16.0.0",
                "@angular/common": "^16.0.0",
                "@angular/compiler": "^16.0.0",
                "@angular/core": "^16.0.0",
                "@angular/forms": "^16.0.0",
                "@angular/platform-browser": "^16.0.0",
                "@angular/platform-browser-dynamic": "^16.0.0",
                "@angular/router": "^16.0.0",
                "rxjs": "~7.8.0",
                "tslib": "^2.3.0",
                "zone.js": "~0.13.0"
            },
            devDependencies: {
                "@angular-devkit/build-angular": "^16.0.0",
                "@angular/cli": "^16.0.0",
                "@angular/compiler-cli": "^16.0.0",
                "@types/jasmine": "~4.3.0",
                "jasmine-core": "~4.6.0",
                "karma": "~6.4.0",
                "karma-chrome-launcher": "~3.2.0",
                "karma-coverage": "~2.2.0",
                "karma-jasmine": "~5.1.0",
                "karma-jasmine-html-reporter": "~2.1.0",
                "typescript": "~5.0.2"
            }
        };

        return JSON.stringify(packageJson, null, 2);
    }



    /**
   * Genera el archivo angular.json con la configuración del proyecto
   */
    generateAngularJson() {
        const angularJson = {
            "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
            "version": 1,
            "newProjectRoot": "projects",
            "projects": {
                [this.projectName]: {
                    "projectType": "application",
                    "schematics": {
                        "@schematics/angular:component": {
                            "style": "scss"
                        }
                    },
                    "root": "",
                    "sourceRoot": "src",
                    "prefix": "app",
                    "architect": {
                        "build": {
                            "builder": "@angular-devkit/build-angular:browser",
                            "options": {
                                "outputPath": "dist/" + this.projectName,
                                "index": "src/index.html",
                                "main": "src/main.ts",
                                "polyfills": [
                                    "zone.js"
                                ],
                                "tsConfig": "tsconfig.app.json",
                                "assets": [
                                    "src/favicon.ico",
                                    "src/assets"
                                ],
                                "styles": [
                                    "src/styles.scss"
                                ],
                                "scripts": []
                            },
                            "configurations": {
                                "production": {
                                    "budgets": [
                                        {
                                            "type": "initial",
                                            "maximumWarning": "500kb",
                                            "maximumError": "1mb"
                                        },
                                        {
                                            "type": "anyComponentStyle",
                                            "maximumWarning": "2kb",
                                            "maximumError": "4kb"
                                        }
                                    ],
                                    "outputHashing": "all"
                                },
                                "development": {
                                    "buildOptimizer": false,
                                    "optimization": false,
                                    "vendorChunk": true,
                                    "extractLicenses": false,
                                    "sourceMap": true,
                                    "namedChunks": true
                                }
                            },
                            "defaultConfiguration": "production"
                        },
                        "serve": {
                            "builder": "@angular-devkit/build-angular:dev-server",
                            "configurations": {
                                "production": {
                                    "browserTarget": this.projectName + ":build:production"
                                },
                                "development": {
                                    "browserTarget": this.projectName + ":build:development"
                                }
                            },
                            "defaultConfiguration": "development"
                        }
                    }
                }
            }
        };

        return JSON.stringify(angularJson, null, 2);
    }

    /**
     * Genera el archivo tsconfig.json con la configuración de TypeScript
     */
    generateTsConfig() {
        const tsConfig = {
            "compileOnSave": false,
            "compilerOptions": {
                "baseUrl": "./",
                "outDir": "./dist/out-tsc",
                "forceConsistentCasingInFileNames": true,
                "strict": true,
                "noImplicitOverride": true,
                "noPropertyAccessFromIndexSignature": true,
                "noImplicitReturns": true,
                "noFallthroughCasesInSwitch": true,
                "sourceMap": true,
                "declaration": false,
                "downlevelIteration": true,
                "experimentalDecorators": true,
                "moduleResolution": "node",
                "importHelpers": true,
                "target": "ES2022",
                "module": "ES2022",
                "useDefineForClassFields": false,
                "lib": [
                    "ES2022",
                    "dom"
                ]
            },
            "angularCompilerOptions": {
                "enableI18nLegacyMessageIdFormat": false,
                "strictInjectionParameters": true,
                "strictInputAccessModifiers": true,
                "strictTemplates": true
            }
        };

        return JSON.stringify(tsConfig, null, 2);
    }

    /**
   * Genera el archivo index.html
   */
    generateIndexHtml() {
        return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${this.projectName}</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
  </head>
  <body>
    <app-root></app-root>
  </body>
  </html>`;
    }

    /**
     * Genera el archivo main.ts
     */
    generateMainTs() {
        return `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
  import { AppModule } from './app/app.module';
  
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  `;
    }


    /**
   * Genera el archivo app.module.ts
   */
    generateAppModule() {
        return `import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { AppComponent } from './app.component';
  import { DesignComponent } from './components/design/design.component';
  
  @NgModule({
    declarations: [
      AppComponent,
      DesignComponent
    ],
    imports: [
      BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
  `;
    }



    generateTsConfigApp() {
        return `{
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/app",
      "types": []
    },
    "files": [
      "src/main.ts"
    ],
    "include": [
      "src/**/*.d.ts"
    ]
  }`;
    }

    generateGlobalStyles() {
        return `/* Global styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
  }`;
    }

    generateAppComponent() {
        return `import { Component } from '@angular/core';
  
  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })
  export class AppComponent {
    title = '${this.projectName}';
  }`;
    }

    generateAppComponentHtml() {
        return `<app-design></app-design>`;
    }

    generateAppComponentScss() {
        return `// Estilos del componente principal`;
    }

    generateEnvironment(isProd) {
        return `export const environment = {
        production: ${isProd},
        // Añade aquí otras variables de entorno
    };`;
    }
}