import  Link  from "next/link";

const MobileAdminHeader = ({ item, isHamburger, setisHamburger }) => {
  const hambugerClick = () => {
    isHamburger ? setisHamburger(false) : setisHamburger(true);
  };

  return (
    <>
      <nav className="admin-mobile-nav">
        <ul className="admin-menus">
          {item.smallLink.map((menu, index) => (
            <li
              key={index}
              className="admin-menu-items"
              onClick={hambugerClick}
            >
              <Link href={menu.link}>{menu.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MobileAdminHeader;
