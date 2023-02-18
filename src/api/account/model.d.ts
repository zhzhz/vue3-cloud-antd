declare namespace API {
    type Menu = {
        // createTime: Date;
        // updateTime: Date;
        // id: number;
        // parentId: number;
        // name: string;
        // router: string;
        // perms: string;
        // /** 当前菜单类型 0: 目录 | 1: 菜单 | 2: 权限 */
        // type: 0 | 1 | 2;
        // icon: string;
        // orderNum: number;
        // viewPath: string;
        // keepalive: boolean;
        // isShow: boolean;
        // /** 是否外链 */
        // isExt?: boolean;
        // /** 外链打开方式
        //  * 1: 新窗口打开
        //  * 2: iframe
        //  */
        // openMode?: 1 | 2;

        ////////////////////////////////////
        id: number,
        parentId: number | null,
        name: string,
        router: string,
      };
    
      type PermMenu = {
        menus: Menu[];
        perms: string[];
      };
}