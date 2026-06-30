

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  href?: string;
  group:string;
//   icon: IconName;
  keywords?: string[];
  shortcut?: string[];
  disabled?: boolean;
}

export function groupCommands(
  commands: CommandItem[]
) {
  return commands.reduce<Record<string, CommandItem[]>>(
    (groups, command) => {
      if (!groups[command.group]) {
        groups[command.group] = [];
      }

      groups[command.group].push(command);

      return groups;
    },
    {}
  );
}