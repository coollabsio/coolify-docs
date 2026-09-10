import type { Folder, Item, Node, Root } from 'fumadocs-core/page-tree';
import { createElement } from 'react';
import { ArrowSquare2 } from 'reicon-react/icons/ArrowSquare2';
import { BookSaved2 } from 'reicon-react/icons/BookSaved2';
import { Box2 } from 'reicon-react/icons/Box2';
import { Cloud } from 'reicon-react/icons/Cloud';
import { CodeCircle } from 'reicon-react/icons/CodeCircle';
import { Database } from 'reicon-react/icons/Database';
import { DocumentText2 } from 'reicon-react/icons/DocumentText2';
import { Heart } from 'reicon-react/icons/Heart';
import { MedalStars } from 'reicon-react/icons/MedalStars';
import { Profile2user2 } from 'reicon-react/icons/Profile2user2';
import { Rocket } from 'reicon-react/icons/Rocket';
import { Server } from 'reicon-react/icons/Server';
import { Settings } from 'reicon-react/icons/Settings';
import { Stars4 } from 'reicon-react/icons/Stars4';
import { TicketDiscount2 } from 'reicon-react/icons/TicketDiscount2';
import { Window } from 'reicon-react/icons/Window';
import { WindowPointer } from 'reicon-react/icons/WindowPointer';

type FolderIndexLink = {
  item: Item;
  includeInChildren?: boolean;
};

const folderIndexLinks = new Map<string, FolderIndexLink>([
  [
    'services/meta.json',
    {
      item: {
        $id: 'services-index',
        type: 'page',
        name: 'Services',
        url: '/services',
      },
    },
  ],
  [
    'troubleshoot/meta.json',
    {
      item: {
        $id: 'troubleshoot-overview-index',
        type: 'page',
        name: 'Overview',
        url: '/troubleshoot',
      },
      includeInChildren: true,
    },
  ],
]);

const homeSidebarItemIconClassName = 'size-4.5 shrink-0 text-fd-muted-foreground';

function homeSidebarIcon(Icon: typeof Rocket) {
  return createElement(Icon, {
    weight: 'Filled',
    className: homeSidebarItemIconClassName,
    'aria-hidden': true,
  });
}

const homeSidebarItemIcons = new Map<string, ReturnType<typeof createElement>>([
  ['/choose-your-path', homeSidebarIcon(ArrowSquare2)],
  ['/start-with-self-hosted', homeSidebarIcon(Server)],
  ['/start-with-cloud', homeSidebarIcon(Cloud)],
  ['/deploy-your-first-app', homeSidebarIcon(WindowPointer)],
  ['/deploy-your-first-database', homeSidebarIcon(Database)],
  ['/deploy-your-first-service', homeSidebarIcon(Settings)],
  ['/screenshots', homeSidebarIcon(Window)],
  ['/sponsors', homeSidebarIcon(Heart)],
  ['/offers', homeSidebarIcon(TicketDiscount2)],
  ['/support', homeSidebarIcon(MedalStars)],
  ['/team', homeSidebarIcon(Profile2user2)],
  ['/contribute/guidelines', homeSidebarIcon(BookSaved2)],
  ['/contribute/coolify', homeSidebarIcon(Stars4)],
  ['/contribute/documentation', homeSidebarIcon(DocumentText2)],
  ['/contribute/service', homeSidebarIcon(Box2)],
]);

function applyFolderIndexLinks(nodes: Node[]) {
  for (const node of nodes) {
    if (node.type !== 'folder') continue;

    const linkedIndex = node.$ref ? folderIndexLinks.get(node.$ref) : undefined;

    if (linkedIndex) {
      node.index = { ...linkedIndex.item };

      if (linkedIndex.includeInChildren && !node.children.some((child) => child.type === 'page' && child.url === node.index?.url)) {
        node.children.unshift({ ...linkedIndex.item });
      }
    }

    const index = node.children.find(
      (child): child is Item => child.type === 'page' && linkedIndex?.item.url === child.url,
    );

    if (index) {
      node.index = { ...index };
    }

    applyFolderIndexLinks(node.children);
  }
}

export function preparePageTree<T extends Root | Folder>(tree: T): T {
  const prepared = {
    ...tree,
    children: tree.children.filter((node) => !(node.type === 'page' && node.url === '/')),
  };

  applyFolderIndexLinks(prepared.children);
  return prepared;
}

export function prepareHomeSidebarPageTree(tree: Root): Root {
  return {
    ...tree,
    children: tree.children
      .filter((node) => !(node.type === 'folder' && node.root === true))
      .map((node) => {
        if (node.type !== 'page') return node;

        const icon = homeSidebarItemIcons.get(node.url);
        if (!icon) return node;

        return { ...node, icon };
      }),
  };
}
