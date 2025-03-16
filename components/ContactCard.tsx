"use client";
import { ContactType } from "@/types/types";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Trash2,
  Star,
  Pencil,
  MoreVertical,
  Lock,
  Unlock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// ContactCard component to display each contact and handle the modal
interface ContactCardInterface {
  contact: ContactType;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onChangeStatus: (id: string, status: string) => void;
}

const ContactCard: React.FC<ContactCardInterface> = ({
  contact,
  onDelete,
  onToggleFavorite,
  onChangeStatus,
}) => {
  const truncateEmail = (email: string, maxLength = 15) => {
    if (email.length > maxLength) {
      return email.slice(0, 3) + "..." + email.slice(-10); // Keep first 10 and last 10 characters
    }
    return email;
  };
  const getStatusMenuItems = () => {
    const status = contact.status || "active"; // Default to active if status is undefined

    if (status === "active") {
      return (
        <>
          <DropdownMenuItem>
            <Link
              href={`/contacts/${contact.id}`}
              className="flex items-center gap-2 w-full"
            >
              <Pencil /> Edit Contact
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onChangeStatus(contact.id, "blocked")}
          >
            <Lock /> Block Contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(contact.id, "bin")}>
            <Trash2 /> Move To Bin
          </DropdownMenuItem>
        </>
      );
    } else if (status === "blocked") {
      return (
        <>
          <DropdownMenuItem
            onClick={() => onChangeStatus(contact.id, "active")}
          >
            <Unlock /> Unblock Contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(contact.id, "bin")}>
            <Trash2 /> Move To Bin
          </DropdownMenuItem>
        </>
      );
    } else if (status === "bin") {
      return (
        <>
          <DropdownMenuItem
            onClick={() => onChangeStatus(contact.id, "active")}
          >
            <RefreshCw /> Restore Contact
          </DropdownMenuItem>
        </>
      );
    }

    // Always show delete forever option for all statuses
    return null;
  };

  return (
    <motion.div
      key={contact.id}
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col px-2 py-4 w-64 shadow-md hover:shadow-lg transition-shadow rounded-2xl dark:bg-gray-800 cursor-pointer">
        {/* Header: Avatar + More Options */}
        <CardHeader className="flex flex-row items-center justify-between">
          <Avatar className="w-14 h-14">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="bg-red-500 text-white text-xl font-semibold">
              {contact.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-row items-center gap-2 justify-between ">
            {contact.status === "active" && (
              <Star
                className={`${
                  contact.favorite ? "text-yellow-400" : "text-gray-500"
                } dark:text-gray-400 hover:text-yellow-400 dark:hover:text-gray-200 cursor-pointer`}
                onClick={() => onToggleFavorite(contact.id)}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem>
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="flex items-center gap-2 w-full"
                  >
                    <Pencil /> Edit Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onChangeStatus(contact.id, "blocked")}
                >
                  <Lock /> Block Contact
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onChangeStatus(contact.id, "bin")}
                >
                  <Trash2 /> Move To Bin
                </DropdownMenuItem> */}
                {getStatusMenuItems()}
                <DropdownMenuItem onClick={() => onDelete(contact.id)}>
                  <XCircle /> Delete Forever
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Contact Details */}
        <CardContent className="mt-2 space-y-2">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {contact.name}
            </p>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">{contact.role}</p> */}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail size={16} className="text-gray-500 dark:text-gray-400" />
            <span>{truncateEmail(contact.email)}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Phone size={16} className="text-gray-500 dark:text-gray-400" />
              <span>{contact.phone}</span>
            </div>
          )}
        </CardContent>

        {/* Footer: Categories */}
        <CardFooter className="flex flex-wrap gap-2 mt-2">
          {contact.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-full"
            >
              {category}
            </span>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ContactCard;
