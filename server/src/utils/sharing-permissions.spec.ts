import { AlbumUserRole, SharingPermission } from 'src/enum';
import { ALBUM_EDITOR_PERMISSIONS, ALBUM_VIEWER_PERMISSIONS, getAlbumPermissionsForRole } from 'src/utils/sharing-permissions';

describe('sharing-permissions', () => {
  it('should grant read-only people access to album viewers', () => {
    expect(getAlbumPermissionsForRole(AlbumUserRole.Viewer)).toEqual(
      expect.arrayContaining([SharingPermission.PersonRead]),
    );
    expect(getAlbumPermissionsForRole(AlbumUserRole.Viewer)).not.toContain(SharingPermission.PersonUpdate);
  });

  it('should grant person update to album editors', () => {
    expect(getAlbumPermissionsForRole(AlbumUserRole.Editor)).toEqual(ALBUM_EDITOR_PERMISSIONS);
    expect(getAlbumPermissionsForRole(AlbumUserRole.Viewer)).toEqual(ALBUM_VIEWER_PERMISSIONS);
  });
});
