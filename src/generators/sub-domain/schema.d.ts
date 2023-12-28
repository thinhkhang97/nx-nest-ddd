export interface SubDomainGeneratorSchema {
  name: string;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  linter?: Linter;
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  tags?: string;
  unitTestRunner?: 'jest' | 'none';
  e2eTestRunner?: 'jest' | 'none';
  setParserOptionsProject?: boolean;
  strict?: boolean;
  templatePath?: string;
}
