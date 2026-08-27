interface Window {
  google?: {
    accounts: {
      id: {
        renderButton(
          current: HTMLDivElement,
          arg1: { type: string; theme: string; size: string; text: string; width: number },
        ): unknown;
        initialize: (options: {
          client_id: string;
          callback: (credentialResponse: any) => void;
          use_fedcm_for_prompt?: boolean;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
          context?: 'signin' | 'signup' | 'use';
          ux_mode?: 'popup' | 'redirect';
        }) => void;
        prompt: (notification?: (notification: unknown) => void) => void;
        cancel: () => void;
        disableAutoSelect: () => void;
      };
    };
  };
}
