import React from 'react';
import { Edit2, Trash2, Download, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';

interface AssetViewProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
}

export const AssetView: React.FC<AssetViewProps> = ({ asset, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{asset.name}</h2>
          <p className="text-sm text-gray-500">Asset ID: {asset.id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            icon={Edit2}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="text-sm text-gray-900">{asset.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="text-sm text-gray-900">{asset.location}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  asset.status === 'Available' ? 'bg-green-100 text-green-800' :
                  asset.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                  asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {asset.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Financial Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Value</dt>
              <dd className="text-sm text-gray-900">{formatCurrency(asset.value)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Acquisition Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(asset.acquisitionDate)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Description</h3>
        <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
          {asset.description}
        </p>
      </div>

      {asset.documents && asset.documents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Documents & Images</h3>
          <ul className="mt-2 grid grid-cols-2 gap-4">
            {asset.documents.map((doc, index) => (
              <li
                key={index}
                className="relative group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB • 
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {doc.type.startsWith('image/') ? (
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <ExternalLink className="h-5 w-5" />
                      )}
                    </a>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={doc.url}
                    download={doc.name}
                    className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 text-gray-500" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-500">Activity Log</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <div>
            <p>Created: {formatDate(asset.createdAt)}</p>
            {asset.lastModifiedAt && (
              <p>Last modified: {formatDate(asset.lastModifiedAt)} by {asset.lastModifiedBy}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};