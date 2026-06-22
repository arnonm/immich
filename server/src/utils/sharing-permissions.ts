import { AlbumUserRole, SharingPermission } from 'src/enum';

/** Read-only album collaborator: can view assets, EXIF, and identified people. */
export const ALBUM_VIEWER_PERMISSIONS: SharingPermission[] = [
  SharingPermission.AssetRead,
  SharingPermission.ExifRead,
  SharingPermission.PersonRead,
];

/** Album editor: viewer permissions plus asset and person editing. */
export const ALBUM_EDITOR_PERMISSIONS: SharingPermission[] = [
  ...ALBUM_VIEWER_PERMISSIONS,
  SharingPermission.AssetUpdate,
  SharingPermission.AssetEdit,
  SharingPermission.PersonUpdate,
];

export const getAlbumPermissionsForRole = (role: AlbumUserRole): SharingPermission[] => {
  if (role === AlbumUserRole.Editor) {
    return ALBUM_EDITOR_PERMISSIONS;
  }

  return ALBUM_VIEWER_PERMISSIONS;
};
