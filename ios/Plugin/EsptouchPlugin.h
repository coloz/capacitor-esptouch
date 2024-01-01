#import <UIKit/UIKit.h>
#import "ESPPacketUtils.h"
#import "ESPProvisioner.h"
#import "ESPProvisioningParams.h"
#import "ESPProvisioningRequest.h"
#import "ESPProvisioningResult.h"
#import "ESPProvisioningUDP.h"
//! Project version number for Plugin.
FOUNDATION_EXPORT double PluginVersionNumber;

//! Project version string for Plugin.
FOUNDATION_EXPORT const unsigned char PluginVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <Plugin/PublicHeader.h>

@interface esptouch2 : CDVPlugin
@property (atomic, strong) ESPProvisioner *provisioner;

- (void)start:(CDVInvokedUrlCommand*)command;

- (void)stop:(CDVInvokedUrlCommand*)command;

@end