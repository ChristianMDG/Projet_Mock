interface Window {
  google?: {
    accounts: {
      id: {
        renderButton(
          current: HTMLDivElement,
          arg1: { type: string; theme: string; size: string; text: string; width: number },
        ): unknown;
        initialize: (options: { client_id: string; callback: (credentialResponse: any) => void }) => void;
        prompt: () => void;
      };
    };
  };
}
