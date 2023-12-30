export interface ApplicationGeneratorSchema {
  name: string;
  templatePath?: string;
  directory?: string;
  importPath?: string;
  publishable?: boolean;
  skipFormat?: boolean;
  skipTsConfig?: boolean;
  strict?: boolean;
  tags?: string;
  target?:
    | 'es5'
    | 'es6'
    | 'esnext'
    | 'es2015'
    | 'es2016'
    | 'es2017'
    | 'es2018'
    | 'es2019'
    | 'es2020'
    | 'es2021';
  testEnvironment?: 'jsdom' | 'node';
  setParserOptionsProject?: boolean;
  skipPackageJson?: boolean;
  simpleName?: boolean;
}
