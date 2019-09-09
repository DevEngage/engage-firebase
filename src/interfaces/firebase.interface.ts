export interface IEngageFirebase {
  ref;
  auth;
  userId: string;
}

export interface IEngageFirebaseObject {
  $id?: string;
  $exists?: boolean;
  $collection?: string;
  $userId?: string;
  $createdAt?: number;
  $updatedAt?: number;
}

export interface IEngageImage {
  $thumb?: string;
  $image?: string;
  $imageMeta?: any;
}

export interface IEngageFirebaseCollection extends IEngageFirebaseObject, IEngageFirebase {
  path?: string;
  updateState?: boolean;
  save();
  set();
  update();
  get(id?);
  remove?(id?, updateState?);
}

export interface IEngageFirebaseDoc extends IEngageFirebaseObject, IEngageFirebase, IEngageImage {
  $id?: string;
  $save(value, updateState?);
  $set(value, updateState?);
  $update(value, updateState?);
  $get(id?);
  // $subscribe?();
  $remove?(updateState?);
}
