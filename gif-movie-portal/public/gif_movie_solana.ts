export type GifMovieSolana = {
  version: "0.1.0";
  name: "gif_movie_solana";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "movieGif";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "gifUrl";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "movieGif";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "gifUrl";
            type: "string";
          }
        ];
      };
    }
  ];
  metadata: {
    address: "aqDdPff6BwXKSXafAeFdE1psX6sC5Qb4c6ChJgvoWeA";
  };
};

export const IDL: GifMovieSolana = {
  version: "0.1.0",
  name: "gif_movie_solana",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "movieGif",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "gifUrl",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "movieGif",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "gifUrl",
            type: "string",
          },
        ],
      },
    },
  ],
  metadata: {
    address: "aqDdPff6BwXKSXafAeFdE1psX6sC5Qb4c6ChJgvoWeA",
  },
};
