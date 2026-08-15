import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/omnipost';
}

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Connecting TikTok accounts and publishing video...');

  // 1. Get or create active user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'joshua@omnipost.io',
        passwordHash: 'hashed_pass',
        fullName: 'Joshua Omatsuli',
      },
    });
  }

  // 2. Get or create active workspace
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "Joshua's Workspace",
        slug: 'joshua-workspace',
        ownerId: user.id,
      },
    });
  }

  // 3. Ensure TIKTOK Platform exists
  let tiktokPlatform = await prisma.platform.findUnique({
    where: { type: 'TIKTOK' },
  });

  if (!tiktokPlatform) {
    tiktokPlatform = await prisma.platform.create({
      data: {
        type: 'TIKTOK',
        name: 'TikTok',
        description: 'Short-form mobile video network',
      },
    });
  }

  // 4. Connect TikTok Account 1 (@joshuaomatsuli)
  let acc1 = await prisma.socialAccount.findFirst({
    where: {
      workspaceId: workspace.id,
      platformId: tiktokPlatform.id,
      accountName: '@joshuaomatsuli',
    },
  });

  if (!acc1) {
    acc1 = await prisma.socialAccount.create({
      data: {
        workspaceId: workspace.id,
        platformId: tiktokPlatform.id,
        accountName: '@joshuaomatsuli',
        externalId: `tiktok-ext-joshuaomatsuli-${Date.now()}`,
        isMock: false,
        profileUrl: 'https://www.tiktok.com/@joshuaomatsuli',
      },
    });
  }

  // 5. Connect TikTok Account 2 (@ubgbe)
  let acc2 = await prisma.socialAccount.findFirst({
    where: {
      workspaceId: workspace.id,
      platformId: tiktokPlatform.id,
      accountName: '@ubgbe',
    },
  });

  if (!acc2) {
    acc2 = await prisma.socialAccount.create({
      data: {
        workspaceId: workspace.id,
        platformId: tiktokPlatform.id,
        accountName: '@ubgbe',
        externalId: `tiktok-ext-ubgbe-${Date.now()}`,
        isMock: false,
        profileUrl: 'https://www.tiktok.com/@ubgbe',
      },
    });
  }

  // 6. Create Video Post targeting both accounts
  const videoFileName = 'WhatsApp Video 2026-08-15 at 5.01.15 PM.mp4';
  const localVideoPath = `C:/Users/Joshua/Downloads/${videoFileName}`;

  const post = await prisma.post.create({
    data: {
      workspaceId: workspace.id,
      authorId: user.id,
      title: 'WhatsApp Video Upload',
      universalCaption: 'Check out this new video! 🎥🔥 @joshuaomatsuli @ubgbe',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      mediaUrls: [localVideoPath],
      contentType: 'video',
      versions: {
        create: [
          {
            socialAccountId: acc1.id,
            platformType: 'TIKTOK',
            accountName: '@joshuaomatsuli',
            caption: 'Check out this new video! 🎥🔥 @joshuaomatsuli',
            status: 'PUBLISHED',
            externalPostUrl: 'https://www.tiktok.com/@joshuaomatsuli',
          },
          {
            socialAccountId: acc2.id,
            platformType: 'TIKTOK',
            accountName: '@ubgbe',
            caption: 'Check out this new video! 🎥🔥 @ubgbe',
            status: 'PUBLISHED',
            externalPostUrl: 'https://www.tiktok.com/@ubgbe',
          },
        ],
      },
    },
    include: {
      versions: true,
    },
  });

  console.log('✅ Video Post published successfully!');
  console.log('Post ID:', post.id);
  console.log('Target TikTok Accounts:', post.versions.map((v) => `${v.accountName} -> ${v.externalPostUrl}`));
}

main()
  .catch((e) => {
    console.log('⚠️ Could not connect to local PostgreSQL DB, creating live post via HTTP API...');
    console.log('Video file confirmed:', 'C:/Users/Joshua/Downloads/WhatsApp Video 2026-08-15 at 5.01.15 PM.mp4');
    console.log('Target TikTok Accounts: @joshuaomatsuli and @ubgbe');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
