export type ISession =
	| {
			type: "unauthenticated";
	  }
	| {
			type: "authenticated";
			userId: string;
	  };
