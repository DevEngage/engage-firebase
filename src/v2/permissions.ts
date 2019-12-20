
export default class EngagePermissions {
  static STORE: any;
  $owner!: string;
  $loading: boolean = true;
  private engageFireStore: any;

  constructor(
    private path: string
  ) {
    this.engageFireStore = EngagePermissions.STORE(path);
    this.$$init();
  }

  async $$init() {
    
  }

  setPermission(userId) {
    this.engageFireStore.save(userId);
  }

}
